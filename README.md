# Node Interpreter for Business Manager
#### :warning: Before usage :warning:
This product is intended for technical people who knows how to properly code in SFCC. 

Unintended usage (like big queries or object deletion) may cause disruption in the system. 
This solution and its effects are **NOT** eligible for Salesforce Support. Use at your own risk.


## Overview
When problems arise, it is not possible to enter in debug mode, that is difficult to handle in production environment, or make custom queries without the help of a Support Ticket. In the meantime the situation is getting worse and worse in your production environment :fire:

A Node interpreter is useful to solve problems fast and precisely!

This tool provides an efficient way to execute custom code that can help developers to understand the root of a problem, to fix data without deploying a new job, export objects, *etc*.

All the standard SFCC functions are available, along with SFRA and custom ones developed by the team.

## Installation
Move to your cartrdiges folder and create a shallow submodule:
```bash
git submodule add --depth 1 git@github.com:davidbertoldi/bm_nodeinterpreter.git
```
The `bm_nodeinterpreter` folder will be added. The submodule will point to branch `main`, that always contains the last stable version.
Alternatively just download this project and put it in a folder called `bm_nodeinterpreter`.

Then add the cartridge to your site's path in *Administration > Manage Sites > Settings* (better if you do it for all the sites).

## Usage
This module must be restricted to admin users.

Move to *Administration > Node Interpreter*.

Put in the editor your code and click Run! 

![example](https://i.imgur.com/3hHEIQU.png)


## Something is not working?
Open an [issue](https://github.com/davidbertoldi/bm_nodeinterpreter/issues/new) in this repository to discuss the problem.
