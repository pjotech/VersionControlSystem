CECS-543 Advance Software Engineering
VCS Project 2


Team: AKP
Members:Aanchal Tandel
	Krishna Desai
        Priya  M Joseph
        Nithin Reddy Allala
        Sujata Patil

=>VCS(Version Control System)
A Version Control System using Node.js.This system will create Repository to maintain different versions of Project.

=>Prerequisites
Node.js(Version 10.15.1 or higher)

=>Running Locally
//Make sure you have node.js installed
Run npm install
Run npm i n-readlines
Run npm start
Main file is app.js

Using User Interface:
1.Your app should now be running on localhost:3000.
2.select one of two options
 (create: To create new repo
  commit:copy project to repository/Push changes made in files/Check-In/Check-Out)
3.(On Create button)Enter Repository name and Location(Folder path) to save it.Empty Repository will be created.
 (Output:Empty Repository with given name should be created at specified path)
4.(On Checkin button)Enter Source Folder Path(Project Directory) and Repository path to copy project to Repository.
   Enter Labels to Uniquely identify Manifestfile for Specific Project Version.
 (Output:Manifest file should be created in manifestfolder in Repository)
5.(On Check-Out button) Enter Repository path to see all available manifest file with  label.Then use manifest label(Version),
	New Project Snapshot name(Folder name),Target Path(Where user wants to create new project snapshot)
 (Output:New Project snapshot should be created with given folder name at target path.Manifest file should be created in manifestfolder in Repository)
6.(On Checkin button)Copy changes made to newly created snapshot to Repository.
(Output:Manifest file should be created in manifestfolder in Repository.Changes should be reflect on repository.)

=>Features
1.Create new repository to maintain project version at desired location
2.Create artifactID for each file
3.Maintain project hierarchy(using relative path)
4.Manifest file
5.CheckIn
6.CheckOut
7.Listing of the labels to the user to identify  version
