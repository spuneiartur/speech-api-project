# What is the purpose of our project's structure ?

We have 3 folders, each one has a specific purpose. It is meant to apply the principle of separation of concerns, we could work at the same time.

-- View folder
View module is responsible for visual part. It will manage how things will be displayed on the screen.

-- Model folder
Model module is responsible for managing all the API's and DATA. It works "behind the scenes".

-- Controller folder
Controller module just connects the Model with the View. It works like a bridge.
