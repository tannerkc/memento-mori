# Memento Mori CLI

A CLI tool to visualize life's journey with a Memento Mori calendar.

## Installation

```bash
$ yarn global add cli-memento-mori
```

## Usage

```bash
$ mori
```
The first time running this, it will ask for your birth date.

or you can manually set it with:
```bash
$ mori --config.birthdate "01.01.1900"
```

You can change the color of the marked days:
```bash
$ mori --config.markedColor "#BB443E"
$ mori --config.daysLeftColor "#8C9A55"
```