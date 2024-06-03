# Evil Node Interpreter for Business Manager 😈
### :warning: Before usage :warning:
This product is **NOT** intendend for production and intended only for technical people who knows how to properly code in SFCC. 

The cartridge should be deployed only in development or sandboxes.

Unintended usage (like big queries or object deletion) may cause disruption in the system. 

This solution and its effects are **NOT** eligible for Salesforce Support. Use at your own risk.


## Overview
A Node interpreter is useful to solve problems fast and precisely!

This tool provides an efficient way to execute custom code that can help developers to understand the root of a problem, to fix data without deploying a new job, export objects, *etc*.

All the standard SFCC functions are available, along with SFRA's and custom ones developed by the team. :muscle:

## Installation
1. :arrow_down: Move to your cartrdiges folder and create a shallow submodule:
   ```bash
   git submodule add --depth 1 -b evil git@github.com:davidbertoldi/bm_nodeinterpreter.git
   ```
   The `bm_nodeinterpreter` folder will be added. The submodule will point to branch `main`, that always contains the last stable version.
   Alternatively just download this project and put it in a folder called `bm_nodeinterpreter`.

2. :page_facing_up: Add the cartridge to BM site's path in *Administration > Manage Sites > Business Manager Site* .

3. :pencil2: Enable it by giving write permissions to the module under *Administration > Organization > Roles > Administration > Business Manager Modules*.

## Usage
This module should be restricted to admin users. :bomb:

Move to *Administration > Node Interpreter*.

Put in the editor your code and click Run! 

![example](https://i.imgur.com/KbShnhC.png?2)


## Something is not working?
:triangular_flag_on_post: Open an [issue](https://github.com/davidbertoldi/bm_nodeinterpreter/issues/new) in this repository to discuss the problem.
