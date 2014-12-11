## Pull Request Guidelines

* Please check to make sure that there aren't existing pull requests attempting to address the issue mentioned. We also recommend checking for related issues on the tracker, as a team member may be working on the issue in a branch or fork
* Non-trivial changes should be discussed in an issue first
* All branches should address an open issue found on the [tracker](https://github.com/ozone-development/meridian/issues?state=open)
* Always create your branch from the latest develop branch, not master or any other branch. To do this, switch to the develop branch before creating the branch and github handles the rest.
* Branches should follow this naming convention: {*type of issue*}/{*issue number*}/{*short description*} => enhancement/1/update-documentation; all lower case character and hyphens where spaces are needed.
	* Accepted type of issues: 
		* bug
		* enhancement
		* tech-debt
		* feature
* Follow the [Meridian JavaScript Style Guide](./app/docs/javascript-styleguide#meridian-javascript-style-guide-forked-from-airbnb) closely
* Lint the code
* To create the pull request, access the [branches](https://github.com/ozone-development/meridian/branches) page and click on `New pull request` on the desired branch.
* Before clicking Create pull request, make sure that:
	* Title is the branch name to be merged. (It may have the name of your last commit)
	* You are asking to merge branch into develop.


## Issue submission

In order for us to help you please check that you've completed the following steps:
* Made sure you're on the latest version.
* Used the search feature to ensure that the issue (enhancement, bug, etc.) hasn't been reported before.
* Included as much information about the issue as possible, including any output you've received, what OS and version you're on, screenshots, etc.  
* Selected the `0 - Backlog` label, the type of issue label (enhancement, bug, etc.) and any other label that best describes the issue

[Submit your issue](https://github.com/ozone-development/meridian/issues/new)


## Style Guide

The [Meridian JavaScript Style Guide](./app/docs/javascript-styleguide#meridian-javascript-style-guide-forked-from-airbnb) is still under review by our developers and may continue to evolve, as needed.

Please ensure any pull requests follow this closely. If you are working in a file and notice existing code which doesn't follow these practices, you can make the relevant updates. Please avoid making style updates outside of the file(s) you are working on.

