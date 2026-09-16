// VS Code extension-host test; run only with disposable user-data and home directories.
const vscode = require('vscode');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const result = { requests: [] };
function save() { fs.writeFileSync(path.join(process.env.WF_PROBE_ROOT, 'results.json'), JSON.stringify(result, null, 2)); }
exports.activate = function (context) {
  context.subscriptions.push(vscode.lm.registerLanguageModelChatProvider('wf-observer', {
    async provideLanguageModelChatInformation() { return [{ id: 'wf-observer', name: 'Fixture observer', family: 'wf-observer', version: '1', maxInputTokens: 128000, maxOutputTokens: 1000, capabilities: { toolCalling: true } }]; },
    async provideTokenCount(_model, value) { return Math.ceil(JSON.stringify(value).length / 4); },
    async provideLanguageModelChatResponse(_model, messages, _options, progress) {
      const text = JSON.stringify(messages);
      result.requests.push({ instructions: [...new Set(text.match(/Report marker wf-[a-z]+-[0-9.]+/g) ?? [])], fixtureReferences: text.match(/.{0,40}wf-alpha.{0,100}/g) });
      save();
      progress.report(new vscode.LanguageModelTextPart('Fixture observer completed.'));
    },
  }));
};
exports.run = async function () {
  try {
    result.version = vscode.version;
    result.home = os.homedir();
    result.userProfile = process.env.USERPROFILE;
    result.copilotHome = process.env.COPILOT_HOME;
    save();
    if (result.home !== path.join(process.env.WF_PROBE_ROOT, 'home')) throw new Error('Home isolation is not established; stop before discovery');
    await vscode.extensions.getExtension('wayfinder.compatibility-probe').activate();
    result.models = (await vscode.lm.selectChatModels({ vendor: 'wf-observer' })).map(m => ({ id: m.id, vendor: m.vendor }));
    result.skillLocations = vscode.workspace.getConfiguration('chat').get('agentSkillsLocations');
    result.pluginLocations = vscode.workspace.getConfiguration('chat').get('pluginLocations');
    save();
    result.extensions = vscode.extensions.all.filter(e => /copilot/i.test(e.id)).map(e => ({ id: e.id, active: e.isActive, version: e.packageJSON.version }));
    save();
    const timeout = new Promise((_, reject) => { const timer = setTimeout(() => reject(new Error('No completed chat within 70 seconds')), 70000); timer.unref(); });
    result.chat = await Promise.race([vscode.commands.executeCommand('workbench.action.chat.open', {
      query: '/wf-alpha', mode: 'agent', modelSelector: { vendor: 'wf-observer', id: 'wf-observer' }, blockOnResponse: true,
    }), timeout]);
    result.status = result.requests.length ? 'Provider received request; inspect markers' : 'No provider request observed';
  } catch (error) { result.error = String(error?.stack ?? error); }
  finally { save(); }
};
