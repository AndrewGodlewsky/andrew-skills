"""Offline regression checks adapted from issue #58; no providers or user files.
Run from the repository root: python -B scripts/caveman-compress-checks.py
"""
import contextlib
import hashlib
import io
import json
from pathlib import Path
import sys
import subprocess
import tempfile
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
PACKAGE = ROOT / 'skills' / 'caveman-compress'
sys.dont_write_bytecode = True
sys.path.insert(0, str(PACKAGE))
from scripts import compress as c, detect as d, validate as v

results = []
def package_snapshot():
    return {str(path.relative_to(PACKAGE)): hashlib.sha256(path.read_bytes()).hexdigest()
            for path in PACKAGE.rglob('*') if path.is_file()}

initial_package = package_snapshot()
def check(name, fn):
    try:
        with contextlib.redirect_stdout(io.StringIO()):
            fn()
        results.append({'name': name, 'status': 'passed'})
    except Exception as error:
        results.append({'name': name, 'status': 'failed', 'detail': str(error)})

def expect(value, message='assertion failed'):
    assert value, message

with tempfile.TemporaryDirectory(prefix='gt-compress-checks-') as temp:
    base = Path(temp)
    def fixture(name, data):
        file = base / name
        file.parent.mkdir(parents=True, exist_ok=True)
        file.write_bytes(data if isinstance(data, bytes) else data.encode())
        return file
    with patch.object(c, '_state_base_dir', lambda kind: base / 'state' / kind):

        def cli_boundaries():
            missing = subprocess.run([sys.executable, '-B', '-m', 'scripts'],
                                     cwd=PACKAGE, capture_output=True, text=True, encoding='utf-8')
            expect(missing.returncode == 2)
            expect('filepath' in missing.stderr)
            file = fixture('cli/code.py', 'print("Unchanged")\n')
            before = file.read_bytes()
            skipped = subprocess.run([sys.executable, '-B', '-m', 'scripts', str(file)],
                                     cwd=PACKAGE, capture_output=True, text=True, encoding='utf-8')
            expect(skipped.returncode == 0)
            expect('Skipping:' in skipped.stdout)
            expect(file.read_bytes() == before)
        check('CLI missing input exits 2; code skip exits 0 and leaves file unchanged', cli_boundaries)
        def success():
            original = b'---\r\nname: Demo\r\n---\r\n# Plan\r\nYou should always run the tests before pushing any changes.\r\n```sh\r\necho exact\r\n```\r\n'
            file = fixture('success/notes.md', original)
            def reply(prompt):
                masked = prompt.split('TEXT:\n', 1)[1].strip()
                return masked.replace('You should always run the tests before pushing any changes.', 'Run tests before push.')+'\n'
            with patch.object(c, 'call_claude', side_effect=reply) as call:
                expect(c.compress_file(file))
                expect(call.call_count == 1)
            expect((c.backup_dir_for(file) / 'notes.original.md').read_bytes() == original)
            output = file.read_bytes()
            expect(b'Run tests before push.' in output)
            expect(output.startswith(b'---\r\nname: Demo\r\n---\r\n'))
            expect(b'```sh\r\necho exact\r\n```\r\n' in output)
            expect(not file.with_name(file.name+'.caveman-staged').exists())
        check('success: exact backup, frontmatter/code/CRLF preservation and staging cleanup', success)

        def rejected_output(label, output):
            file = fixture(label+'/notes.md', '# Plan\nPlease run all the tests before pushing any changes.\n')
            before = file.read_bytes()
            with patch.object(c, 'call_claude', return_value=output):
                expect(c.compress_file(file) is False)
            expect(file.read_bytes() == before)
            expect(not (c.backup_dir_for(file)/'notes.original.md').exists())
        check('empty model response leaves original untouched', lambda: rejected_output('empty', ''))
        check('expanded model response leaves original untouched', lambda: rejected_output('expanded', '# Plan\n'+'extra prose '*100))

        def retry():
            file = fixture('retry/notes.md', '# Plan\nYou should run all tests before pushing any changes.\n')
            with patch.object(c, 'call_claude', side_effect=['# Wrong\nRun tests.\n', '# Plan\nRun tests.\n']) as call:
                expect(c.compress_file(file))
                expect(call.call_count == 2)
            expect(file.read_text() == '# Plan\nRun tests.\n')
        check('validation failure receives one successful targeted repair', retry)

        def exhausted():
            file = fixture('exhausted/notes.md', '# Plan\nYou should run all tests before pushing any changes.\n')
            before=file.read_bytes()
            with patch.object(c, 'call_claude', return_value='# Wrong\nRun tests.\n') as call:
                expect(c.compress_file(file) is False)
                expect(call.call_count == 2, 'observed call count differs from implementation review')
            expect(file.read_bytes()==before)
            expect(not (c.backup_dir_for(file)/'notes.original.md').exists())
            expect(not file.with_name(file.name+'.caveman-staged').exists())
        check('exhaustion: two validations/one repair, original unchanged and cleanup', exhausted)

        def collision():
            file=fixture('collision/notes.md','Please run tests before pushing code.\n')
            backup=c.backup_dir_for(file)/'notes.original.md'
            backup.parent.mkdir(parents=True);backup.write_text('keep backup')
            with patch.object(c,'call_claude',side_effect=AssertionError('unexpected network boundary')):
                expect(c.compress_file(file) is False)
            expect(backup.read_text()=='keep backup')
        check('existing backup prevents model call and overwrite', collision)

        def guards():
            for name,content in [('credentials.md','private fixture'),('big.md',b'x'*500001),('bad.md',b'\xff')]:
                file=fixture('guards/'+name,content);before=file.read_bytes()
                with patch.object(c,'call_claude',side_effect=AssertionError('unexpected model call')):
                    try:c.compress_file(file)
                    except ValueError:pass
                    else:raise AssertionError('guard did not reject '+name)
                expect(file.read_bytes()==before)
        check('sensitive name, 500KB limit and invalid UTF-8 reject before model call', guards)

        def types():
            cases={'notes.md':True,'rule.mdc':True,'guide.rst':True,'guide.markdown':True,'code.py':False,'CMakeLists.txt':False,'Dockerfile':False,'notes.original.md':False}
            for name,expected in cases.items():
                expect(d.should_compress(fixture('types/'+name,'Natural language instructions.\n')) is expected,name)
        check('actual extension and backup/build-file filtering', types)

        def markers():
            text='Words.\n```sh\necho hi\n```\n'
            masked,blocks=c.mask_code_blocks(text)
            expect(c.restore_code_blocks(masked,blocks)==text)
            try:c.restore_code_blocks(masked.replace(blocks[0][0],''),blocks)
            except ValueError:pass
            else:raise AssertionError('missing marker accepted')
        check('code marker round-trip and removal rejection', markers)

        def validation():
            original=fixture('validators/original.md','# Plan\nUse `npm test` and https://example.com/docs with ./src/app.py.\n```js\nconst a = 1;\n```\n')
            for old,new in [('# Plan','# Other'),('`npm test`','`npm run other`'),('https://example.com/docs','https://example.com/other'),('./src/app.py','removed'),('const a = 1;','const a = 2;')]:
                altered=fixture('validators/altered.md',original.read_text().replace(old,new))
                expect(v.validate(original,altered).is_valid is False,old)
        check('validator rejects changed headings, inline code, URLs, paths and fenced code',validation)

        def repair_frontmatter():
            for newline in ('\n', '\r\n'):
                for variant, header in (
                    ('changed', '---\nowner: Bob\n---\n'),
                    ('removed', ''),
                    ('malformed', '---\nowner: Bob\n'),
                    ('unchanged', '---\nowner: Alice\n---\n'),
                ):
                    name = 'fm-' + variant + ('-crlf' if newline == '\r\n' else '-lf')
                    original = ('---\nowner: Alice\n---\n# Plan\n'
                                'You should run all the tests before pushing changes.\n').replace('\n', newline).encode()
                    file = fixture(name + '/notes.md', original)
                    with patch.object(c, 'call_claude', side_effect=[
                        '# Wrong\nRun tests.\n', header + '# Plan\nRun tests.\n'
                    ]) as call:
                        expect(c.compress_file(file) is (variant == 'unchanged'), variant)
                        expect(call.call_count == 2)
                    backup = c.backup_dir_for(file) / 'notes.original.md'
                    if variant == 'unchanged':
                        expect(file.read_bytes() == (header + '# Plan\nRun tests.\n').replace('\n', newline).encode())
                        expect(backup.read_bytes() == original)
                    else:
                        expect(file.read_bytes() == original, variant)
                        expect(not backup.exists(), variant)
                    expect(not file.with_name(file.name + '.caveman-staged').exists())
            file = fixture('fm-added/notes.md', 'Long prose says run all tests before pushing changes.\n# Plan\nPlease run tests.\n')
            before = file.read_bytes()
            with patch.object(c, 'call_claude', side_effect=[
                'Run tests.\n# Wrong\nRun tests.\n',
                '---\nowner: Bob\n---\nRun tests.\n# Plan\nRun tests.\n'
            ]):
                expect(c.compress_file(file) is False)
            expect(file.read_bytes() == before)
        check('repair frontmatter: changed/removed/malformed/added reject; exact LF/CRLF succeeds', repair_frontmatter)

        def known_gaps():
            original=fixture('gaps/original.md','---\nowner: Alice\n---\n# Plan\nRun 12 tasks on 2026-10-01.\n')
            changed=fixture('gaps/changed.md','---\nowner: Bob\n---\n# Plan\nRun 99 tasks on 2030-01-01.\n')
            expect(v.validate(original,changed).is_valid, 'documented validation gap changed')
        check('known limitation reproduced: validator does not enforce frontmatter/numeric semantics',known_gaps)

check('runtime package remains byte-for-byte unchanged by checks',
      lambda: expect(package_snapshot() == initial_package))
output={'status':'passed' if all(x['status']=='passed' for x in results) else 'failed','scope':'Offline synthetic fixtures and mocked Claude responses; no live provider calls. The standalone-validator gap case records an existing limitation, not desired behavior.','checks':results}
print(json.dumps(output))
sys.exit(0 if output['status']=='passed' else 1)
