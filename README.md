# TepidProject
This repository contains code used for the TEPid paper. This includes code to
1. Create a machine learning model to accurately predict TEPid values from SMILES strings
2. Generate a new, electronically-balanced phosphine ligand database
3. Create a website to make the TEPid model accessible.

## Navigating the Repository
1. Machine_Learning_Model has two Jupyter notebooks for creating and optimizing a machine-learning model to predict Tolman Electronic Parameter (TEP) values. Machine_Learning_Model/LGBMReg_model.pkl contains the saved model.
2. Phosphine_Database contains the Jupyter notebook used to generate an electronically-balanced phosphine ligand dataset (>150,000 phosphines) from the ReaLigands database. The protocol for creating new phosphines from  combinations of substituents was based on the protocol used in the [Kraken paper](https://pubs.acs.org/doi/10.1021/jacs.1c09718). The compressed data frame of new phosphine ligands is in 'full_db.zip'.
3. TEPid_Website contains code for the [TEPid website](https://tepid.chem.byu.edu/), currently hosted at https://tepid.chem.byu.edu/. The website allows users to insert a SMILES string of a phosphine ligand (PRR'R'') and it returns the predicted TEP value. Additionally, a CSV file (<5MB) of phosphine ligands can be uploaded and ran through the model. The website was built using NodeJS and vanilla Javascript. It can be run locally with either NPM/NodeJS or Docker.

## Running the TEPid Website Locally
If you want to experiment with this website, feel free to clone this GitHub or download the TEPid_Website folder.

The website can either be run directly with NodeJS or through Docker (which will create an Image with NodeJS). Both processes are described below. 

### Using NodeJS
1. Ensure that you have NodeJS and npm installed on your computer with:  
`node -v` and `npm -v`.
If those are not installed, follow [this guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).  
2. Move to the website folder at the terminal.  
3. Run `npm install`.  
4. Run `node app.js`.  
5. Open the website at localhost:3000 on your browser of choice.  

### Using Docker
1. Ensure you have Docker up and running. It can be downloaded [here](https://docs.docker.com/get-docker/).
2. Navigate to the folder containing the website on the terminal.
3. Run `./build_docker.sh`
4. Run `./run_docker/sh`
5. Open the website at localhost:8080 on your browser of choice.

   
