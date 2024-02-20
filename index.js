#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const prompts = require('prompts');
const chalk = require('chalk');

// Default configuration values
const DEFAULT_CONFIG = {
  color: 'red',
  birthdate: null,
};

// Path to the configuration file
const CONFIG_FILE_PATH = path.join(__dirname, 'config.json');

// Function to load configuration from file
const loadConfig = () => {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE_PATH, 'utf-8'));
  } catch (error) {
    return DEFAULT_CONFIG;
  }
};

// Function to save configuration to file
const saveConfig = (config) => {
  fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config, null, 2));
};

// Function to display help information
const showHelp = () => {
  console.log(`
Usage: memento-mori [options]

Options:
  --config.color <color>        Set color for days lived (e.g., "red", "#FF0000")
  --config.birthdate <birthdate> Set birthdate (e.g., "01/18/1998", "01.18.1998")
  --help                         Display this help message
`);
};

// Function to validate color format
const isValidColor = (color) => {
  return /^#([0-9a-fA-F]{3}){1,2}$/.test(color) || ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray'].includes(color.toLowerCase());
};

// Function to validate birthdate format
const isValidBirthdate = (birthdate) => {
  return /^\d{1,2}[\/.-]\d{1,2}[\/.-]\d{4}$/.test(birthdate);
};

// Function to display the Memento Mori grid
const displayMementoMori = (config) => {
  const currentDate = new Date();
  const birthdate = new Date(config.birthdate);
  const daysLived = Math.floor((currentDate - birthdate) / (1000 * 60 * 60 * 24));

  let grid = '';
  for (let i = 0; i < 365; i++) {
    if (i < daysLived) {
      grid += chalk.bgHex(config.color).black(' ');
    } else {
      grid += ' ';
    }

    if ((i + 1) % 7 === 0) {
      grid += '\n';
    }
  }

  console.log(grid);
};

// Define CLI options and actions
program
  .option('--config.color <color>', 'Set color for days lived')
  .option('--config.birthdate <birthdate>', 'Set birthdate')
  .option('--help', 'Display help message')
  .parse(process.argv);

// Handle --help flag
if (program.help) {
  showHelp();
  process.exit();
}

// Load configuration from file
let config = loadConfig();

// Update configuration with command-line arguments
if (program.configColor && isValidColor(program.configColor)) {
  config.color = program.configColor;
}

if (program.configBirthdate && isValidBirthdate(program.configBirthdate)) {
  config.birthdate = program.configBirthdate;
}

// If birthdate is not set, prompt the user to enter it
if (!config.birthdate) {
  (async () => {
    const response = await prompts({
      type: 'date',
      name: 'birthdate',
      message: 'Please enter your birthdate (MM/DD/YYYY):'
    });
    config.birthdate = response.birthdate;
    saveConfig(config);
    displayMementoMori(config);
  })();
} else {
  saveConfig(config);
  displayMementoMori(config);
}
