## End of Life Notice:
We have decided to discontinue supporting the development and support of the Meridian Framework in the short term. If interests sparks, we will be happy to pick this back up! In the meantime if you have any questions or concerns please feel free to reach out to @jlfoster, @@cwilmsen, @Bill345, or @sethmussey.

[ ![Codeship Status for ozone-development/meridian](https://codeship.com/projects/479f9b90-5167-0132-a553-7262abc25231/status)](https://codeship.com/projects/48335)

![alt tag](http://ozone-development.github.io/meridian/images/logos/merid1.2.png)

Event-driven, framework-agnostic, extensible architecture for mapping applications. Meridian wraps code into reusable and decoupled components and/or extensions that can easily communicate with each other. 



## Embed Meridian:

Just include the following `<iframe>` on any HTML page source code:

`<iframe src="https://<hostname>:3000/"></iframe>`
- You can add style to the `<iframe>` to suit any need.
- Meridian utilizes [CMAPI](http://cmapi.org) to recieve and send information while it is embedded.

## Download Meridian and host locally:

To host the database locally (which will be populated with mock data), you will need to have [Node.js](http://nodejs.org/) installed and found in the path, and [ElasticSearch] (http://www.elasticsearch.org/overview/elkdownloads/) exported into the `data` folder, making sure the path: `data/bin/` is valid. 

### Note: Some modules in the node_module folder are not version-current for stability purposes. 

As a result, you may receive WARN messages from Node, but Meridian should still run just fine.

The project uses Grunt for task management. Use of Grunt is optional, but highly recommended. If you would like the Grunt task to automatically start ElasticSearch (instead of you doing it manually), follow the Grunt Support Setup instructions.

### Optional: Install Grunt CLI

- First make sure the Node Packaged Module is installed by installing [Node.js](http://nodejs.org/).

- To use the command-line version of Grunt you will need to install the global [Grunt CLI](http://gruntjs.com/getting-started) module.

 - Run `npm install -g grunt-cli` if needed
 
### JSDOM 

The project also uses [JSDOM](https://www.npmjs.org/package/jsdom). Unfortunately, JSDOM relies on a node package called Contextify that is difficult to get working in WINDOWS. To install JSDOM you will need:

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

Please ensure you read the above requirements to make sure everything needed is installed.

#### Clone the Repo

Before you go any further, Clone the Repo: 
`git clone https://github.com/ozone-development/meridian.git`

Now change into the Meridian project directory: `cd meridian`.

You now have two options for getting Meridian running: with, or without, the Grunt support.

**Option 1 -** Without Grunt support:

1. Run `npm install -g` to make sure everything is up to date. 

  - **For windows users:** Make sure to use the `Windows SDK 7.1 Command Prompt` as Administrator and set the command prompt environment to x86 by running `setenv /x86`. The command prompt can be found in the Start Menu after the SDK has been installed.

1. Start ElasticSearch:
	1. Run `data/bin/elasticsearch` on Unix, or `data/bin/elasticsearch.bat` on Windows.
	1. Run `curl -X GET http://localhost:9200/` or visit `http://localhost:9200` to ensure ElasticSearch is running.

1. Start the App Server:
    1. To start the local server run: `node app.js`
    1. Now open your browser and visit ([https://localhost:3000](https://localhost:3000)) to see Meridian in action.

NOTE: If when starting ElasticSearch you recieve warnings regarding multicasting you most likely have been added to an already existing ElasticSearch cluster and may recieve unintended outcomes from the application.  You can disable multicasting by navigating to the directory you extracted ElasticSearch to and then navigating to the config/elasticsearch.yml file. In there uncomment the line `discovery.zen.ping.multicast.enabled: false` and save the file. You can now restart ElasticSearch.

**Option 2 -** With Grunt Support:

1. If you haven't already, get Grunt's global CLI module. Run `npm install -g grunt-cli`.

1. Run `npm install` to make sure everything is up to date.

  - **For windows users:** Make sure to use the `Windows SDK 7.1 Command Prompt` as Administrator and set the command prompt environment to x86 by running `setenv /x86`. The command prompt can be found in the Start Menu after the SDK has been installed. 

 At this point, you will be able to run the Grunt tasks.

*Some Node Modules have been checked into the repo (not a normal best practice),
The node_modules directory will be removed from the project at a later point, 
when the team is comfortable with the process. In the future, 
developers will be responsible for running `npm install` to get the dependencies.*

1. Make sure ElasticSearch starts okay, even though you will be using grunt to start it for you:
 1. Change into the `meridian` directory, if you are not already there.
 1. Run `data/bin/elasticsearch` on Unix, or `data/bin/elasticsearch.bat` on Windows.
 1. Run `curl -X GET http://localhost:9200/` or visit `http://localhost:9200` to make sure ElasticSearch is running.
 1. Stop ElasticSearch; Grunt will start it for you.

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

More information about contributions can be found in our [Contributing documentation](./contributing.md#contributing).
