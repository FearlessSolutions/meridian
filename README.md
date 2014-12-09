[ ![Codeship Status for ozone-development/meridian](https://codeship.com/projects/479f9b90-5167-0132-a553-7262abc25231/status)](https://codeship.com/projects/48335)

# Meridian
Event-driven, framework-agnostic, extensible architecture for mapping applications. Meridian wraps code into reusable and decoupled components and/or extensions that can easily communicate with each other. 

## Embed Meridian:

Just include the following `<iframe>` on any HTML page source code:

`<iframe src="https://ec2-54-88-124-5.compute-1.amazonaws.com:3000/"></iframe>`
- You can add style to the `<iframe>` to suit any need.
- Meridian utilizes [CMAPI](http://cmapi.org) to recieve and send information while it is embedded.

##Access Meridian:
https://ec2-54-88-124-5.compute-1.amazonaws.com:3000/

## Download Meridian and host locally:
### Requirements

The project uses Grunt for task management. Use of Grunt is optional, but highly recommended.

- To install grunt, make sure the Node Packaged Module is installed by installing [Node.js](http://nodejs.org/).

- To use the command-line version of Grunt you will need to install the global [Grunt CLI](http://gruntjs.com/getting-started) module.

 - Run `npm install -g grunt-cli` if needed

To host the database locally (which will be populated with mock data), you will need to have [Node.js](http://nodejs.org/) installed and found in the path, and the ElasticSearch we provide running. If you would like the Grunt task to automatically start ElasticSearch (instead of you doing it manually), follow the Grunt Support Setup instructions.

The project also uses [JSDOM](https://www.npmjs.org/package/jsdom). Unfortunately, JSDOM relies on a node package called Contextify that is difficult to get working in Windows. To install JSDOM you will need:

- [Python 2.7](https://www.python.org/download/releases/2.7/)  installed and found in the path.

- [Node.js](http://nodejs.org/) installed and found in the path.

- At least [.NET 4.5](http://www.microsoft.com/en-us/download/details.aspx?id=8279) installed.

- [Windows SDK 7.1](http://www.microsoft.com/en-us/download/details.aspx?id=8279) installed.

- [Service Pack 1 Compiler Update](http://www.microsoft.com/en-us/download/details.aspx?id=4422) installed.

- Add a System Variable called `WindowsSDKDir` with the installation location of the Windows SDK. It will most likely be `C:\Program Files\Microsoft SDKs\Windows\v7.1\Bin` or `C:\Program Files (x86)\Microsoft SDKs\Windows\v7.1\Bin`.


For other parts of the project, make sure:

1. The JAVA_HOME variable is defined. 

1. Import the given user.p12 certificate into your browser:
    
    *Mac OS: Make sure to import the certificate in the login section of Keychain Access and not in the System section.*
  - Password: 'password'
  - Chrome: Settings>Show Advanced Settings>(HTTPS/SSL)Manage certificates>Import
  - FireFox: Options>Advanced>Certificates>View Certificates>Import
  - You might need to restart the browser after importing the certificate.


### Setup

You have two options for getting up an running, with or without the Grunt support.

**Option 1 -** Without Grunt support:

1. Clone the repo: `git clone https://github.com/ozone-development/meridian.git`.

1. Change into the project directory: `cd meridian`.

1. Run `npm install` to make sure everything is up to date. 

  - **For windows users:** Make sure to use the `Windows SDK 7.1 Command Prompt` as Administrator and set the command prompt environment to x86 by running `setenv /x86`. The command prompt can be found in the Start Menu after the SDK has been installed.

1. Start ElasticSearch:
	1. Run `bin/elasticsearch` on Unix, or `bin/elasticsearch.bat` on Windows.
	1. Run `curl -X GET http://localhost:9200/` or visit `http://localhost:9200` to make sure elasticsearch is running.

1. Start the App Server:
    1. To start the local server run: `node app.js`
    1. Now open your browser and visit ([https://localhost:3000](https://localhost:3000)) to see Meridian in action.

**Option 2 -** With Grunt Support:

1. Get Grunt's global CLI module. Run `npm install -g grunt-cli`.

1. Clone the repo: `git clone https://github.com/ozone-development/meridian.git`.

1. Change into the project directory: `cd meridian`.

1. Run `npm install` to make sure everything is up to date.

  - **For windows users:** Make sure to use the `Windows SDK 7.1 Command Prompt` as Administrator and set the command prompt environment to x86 by running `setenv /x86`. The command prompt can be found in the Start Menu after the SDK has been installed. 

 At this point, you will be able to run the Grunt tasks.

*Some Node Modules have been checked into the repo (not a normal best practice),
The node_modules directory will be removed from the project at a later point, 
when the team is comfortable with the process. In the future, 
developers will be responsible for running `npm install` to get the dependencies.*

1. Make sure ElasticSearch starts okay, even though you will be using grunt to start it for you:
 1. Change into the `meridian` directory, if you are not already there.
 1. Run `bin/elasticsearch` on Unix, or `bin/elasticsearch.bat` on Windows.
 1. Run `curl -X GET http://localhost:9200/` or visit `http://localhost:9200` to make sure elasticsearch is running.

1. Start the App Server:
    1. To start the local server run: `grunt server`
    1. This will open the main page ([https://localhost:3000](https://localhost:3000)) in your default browser.

NOTE: If when starting elastic search you recieve warnings regarding multicasting you most likely have been added to an already exsisting elastic search cluster and may recieve unintended outcomes from the application.  You can disable multicasting by navigating to the directory you extracted elastic search to and then navigating to the config/elasticsearch.yml file. In there uncomment the line `discovery.zen.ping.multicast.enabled: false` and save the file. You can now restart elastic search.

**Resources within the running App**

The main page ([https://localhost:3000](https://localhost:3000)).

To view the documentation page, go to [https://localhost:3000/docs/meridian](https://localhost:3000/docs/meridian).


## Guides

Introduction to Meridian can be found [here](http://ozone-development.github.io/meridian/).

Much of the Design is based on [Aura](http://aurajs.com/). 

Meridian utilizes [CMAPI](http://cmapi.org) to recieve and send information while it is embedded.


## Copyrights
> Software (c) 2014 [The Boeing Company](http://www.boeing.com/ "Boeing")

> The United States Government has unlimited rights in this software, pursuant to the contracts under which it was developed.  
 
The AML Center (under OZONE) is released to the public as Open Source Software, because it's the Right Thing To Do. Also, it was required by [Section 924 of the 2012 National Defense Authorization Act](http://www.gpo.gov/fdsys/pkg/PLAW-112publ81/pdf/PLAW-112publ81.pdf "NDAA FY12").

Released under the [Apache License, Version 2](http://www.apache.org/licenses/LICENSE-2.0.html "Apache License v2").


## Community
 
### OWF GOSS Board
OWF started as a project at a single US Government agency, but developed into a collaborative project spanning multiple federal agencies.  Overall project direction is managed by "The OWF Government Open Source Software Board"; i.e. what features should the core team work on next, what patches should get accepted, etc.  Gov't agencies wishing to be represented on the board should check http://owfgoss.org for more details.  Membership on the board is currently limited to Government agencies that are using OWF and have demonstrated willingness to invest their own energy and resources into developing it as a shared resource of the community.  At this time, the board is not considering membership for entities that are not US Government Agencies, but we would be willing to discuss proposals.
 
### Contributions

#### Non-Government
Contributions to the baseline project from outside the US Federal Government should be submitted as a pull request to the core project on GitHub.  Before patches will be accepted by the core project, contributors have a signed [Contributor License Agreement](https://www.ozoneplatform.org/ContributorLicenseAgreement1-3OZONE.docx) on file with the core team.  If you or your company wish your copyright in your contribution to be annotated in the project documentation (such as this README), then your pull request should include that annotation.
 
#### Government
Contributions from government agencies do not need to have a CLA on file, but do require verification that the government has unlimited rights to the contribution.  An email to goss-support@owfgoss.org is sufficient, stating that the contribution was developed by an employee of the United States Government in the course of his or her duties. Alternatively, if the contribution was developed by a contractor, the email should provide the name of the Contractor, Contract number, and an assertion that the contract included the standard "Unlimited rights" clause specified by [DFARS 252.227.7014](http://www.acq.osd.mil/dpap/dars/dfars/html/current/252227.htm#252.227-7014) "Rights in noncommercial computer software and noncommercial computer software documentation".
 
Government agencies are encouraged to submit contributions as pull requests on GitHub.

More information about contributions can be found in our [Contributing documentation](./contributing.md#contributing).
