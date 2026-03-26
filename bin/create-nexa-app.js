#!/usr/bin/env node

/**
 * create-nexa-app
 * One-command scaffold for AI-powered Next.js apps using NexaAPI
 * https://rapidapi.com/user/nexaquency
 */

const path = require('path');
const fs = require('fs');

// Try to load dependencies, install if missing
let prompts, kleur, ora, fse;
try {
  prompts = require('prompts');
  kleur = require('kleur');
  ora = require('ora');
  fse = require('fs-extra');
} catch (e) {
  console.error('Dependencies missing. Please run: npm install');
  process.exit(1);
}

const args = process.argv.slice(2);
const projectName = args[0];

// ─── Banner ────────────────────────────────────────────────────────────────

function printBanner() {
  console.log(kleur.cyan().bold(`
  ███╗   ██╗███████╗██╗  ██╗ █████╗      █████╗ ██████╗ ██████╗ 
  ████╗  ██║██╔════╝╚██╗██╔╝██╔══██╗    ██╔══██╗██╔══██╗██╔══██╗
  ██╔██╗ ██║█████╗   ╚███╔╝ ███████║    ███████║██████╔╝██████╔╝
  ██║╚██╗██║██╔══╝   ██╔██╗ ██╔══██║    ██╔══██║██╔═══╝ ██╔═══╝ 
  ██║ ╚████║███████╗██╔╝ ██╗██║  ██║    ██║  ██║██║     ██║     
  ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝    ╚═╝  ╚═╝╚═╝     ╚═╝     
  `));
  console.log(kleur.white('  🚀 Create full-stack AI apps powered by NexaAPI'));
  console.log(kleur.gray('  Up to 4x cheaper than OpenAI, fal.ai & Replicate\n'));
  console.log(kleur.yellow('  📦 https://rapidapi.com/user/nexaquency\n'));
}

// ─── Templates ─────────────────────────────────────────────────────────────

const TEMPLATES = {
  'image-gen': {
    label: 'Image Generation (FLUX, Imagen, GPT-Image)',
    description: 'Generate images from text prompts using FLUX.1, Imagen 4, or GPT-Image-1.5',
    apiRoute: 'image',
  },
  'video-gen': {
    label: 'Video Generation (Kling, Veo, Sora)',
    description: 'Generate AI videos from text/image using Kling 3.0, Veo 3, or Sora 2',
    apiRoute: 'video',
  },
  'tts': {
    label: 'Text-to-Speech (ElevenLabs, Gemini TTS)',
    description: 'Convert text to natural speech using ElevenLabs V3 or Gemini TTS',
    apiRoute: 'tts',
  },
  'full': {
    label: 'Full AI Suite (Image + Video + TTS)',
    description: 'Complete AI studio with all capabilities in one app',
    apiRoute: 'all',
  },
};

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  printBanner();

  // Get project name
  let name = projectName;
  if (!name) {
    const res = await prompts({
      type: 'text',
      name: 'projectName',
      message: 'What is your project name?',
      initial: 'my-nexa-app',
      validate: v => v.trim().length > 0 ? true : 'Project name is required',
    });
    if (!res.projectName) process.exit(0);
    name = res.projectName.trim();
  }

  // Validate project name
  if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
    console.error(kleur.red('❌ Project name can only contain letters, numbers, hyphens, and underscores'));
    process.exit(1);
  }

  // Check if directory exists
  const targetDir = path.resolve(process.cwd(), name);
  if (fs.existsSync(targetDir)) {
    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: `Directory "${name}" already exists. Overwrite?`,
      initial: false,
    });
    if (!overwrite) process.exit(0);
    fse.removeSync(targetDir);
  }

  // Choose template
  const { template } = await prompts({
    type: 'select',
    name: 'template',
    message: 'What would you like to build?',
    choices: Object.entries(TEMPLATES).map(([value, t]) => ({
      title: t.label,
      description: t.description,
      value,
    })),
    initial: 0,
  });
  if (!template) process.exit(0);

  // Get RapidAPI key
  const { apiKey } = await prompts({
    type: 'text',
    name: 'apiKey',
    message: 'Enter your NexaAPI RapidAPI key (get free at rapidapi.com/user/nexaquency):',
    initial: 'YOUR_RAPIDAPI_KEY',
  });

  // Confirm
  console.log('\n' + kleur.cyan('📋 Project summary:'));
  console.log(kleur.white(`  Name:     ${name}`));
  console.log(kleur.white(`  Template: ${TEMPLATES[template].label}`));
  console.log(kleur.white(`  Dir:      ${targetDir}`));
  console.log('');

  const { confirm } = await prompts({
    type: 'confirm',
    name: 'confirm',
    message: 'Create project?',
    initial: true,
  });
  if (!confirm) process.exit(0);

  // Scaffold
  const spinner = ora('Scaffolding project...').start();

  try {
    await scaffoldProject({ name, template, targetDir, apiKey: apiKey || 'YOUR_RAPIDAPI_KEY' });
    spinner.succeed(kleur.green('Project created!'));
  } catch (err) {
    spinner.fail(kleur.red('Failed to scaffold project'));
    console.error(err);
    process.exit(1);
  }

  // Done
  console.log('\n' + kleur.green().bold('✅ Done! Your AI app is ready.\n'));
  console.log(kleur.white('Next steps:\n'));
  console.log(kleur.cyan(`  cd ${name}`));
  console.log(kleur.cyan('  npm install'));
  console.log(kleur.cyan('  npm run dev\n'));
  console.log(kleur.gray('Then open http://localhost:3000\n'));
  console.log(kleur.yellow('💡 Get your free API key at: https://rapidapi.com/user/nexaquency'));
  console.log(kleur.gray('   Up to 4x cheaper than OpenAI, fal.ai & Replicate\n'));
}

// ─── Scaffolding ────────────────────────────────────────────────────────────

async function scaffoldProject({ name, template, targetDir, apiKey }) {
  fse.ensureDirSync(targetDir);

  const templateDir = path.join(__dirname, '..', 'templates', template);

  // Copy template files
  if (fs.existsSync(templateDir)) {
    fse.copySync(templateDir, targetDir, {
      filter: (src) => !src.includes('node_modules'),
    });
  } else {
    // Generate files programmatically if template dir missing
    await generateProjectFiles({ name, template, targetDir, apiKey });
    return;
  }

  // Replace placeholders
  replacePlaceholders(targetDir, {
    '{{PROJECT_NAME}}': name,
    '{{RAPIDAPI_KEY}}': apiKey,
  });
}

function replacePlaceholders(dir, replacements) {
  const files = getAllFiles(dir);
  for (const file of files) {
    try {
      let content = fs.readFileSync(file, 'utf8');
      let changed = false;
      for (const [from, to] of Object.entries(replacements)) {
        if (content.includes(from)) {
          content = content.split(from).join(to);
          changed = true;
        }
      }
      if (changed) fs.writeFileSync(file, content, 'utf8');
    } catch (e) {
      // Skip binary files
    }
  }
}

function getAllFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      getAllFiles(full, files);
    } else {
      files.push(full);
    }
  }
  return files;
}

// ─── Programmatic generation (fallback) ─────────────────────────────────────

async function generateProjectFiles({ name, template, targetDir, apiKey }) {
  const Generator = require('../lib/generator');
  await Generator.generate({ name, template, targetDir, apiKey });
}

main().catch(err => {
  console.error(kleur.red('Error: ' + err.message));
  process.exit(1);
});
