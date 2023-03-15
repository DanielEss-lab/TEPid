#Take a smileString,
#Extract the needed features using morded,
#Run through features through our ML model to predict a Tolman's parameter
#Return this predicted Tolman's parameter as a print statement to app.js 

import sys
from rdkit import Chem
from rdkit.Chem import Draw
from mordred import Calculator, Autocorrelation, Constitutional, Weight, MoeType, EState, InformationContent
import numpy as np
import pickle

smileString= sys.argv[1]
imageID = sys.argv[2]
uploadImagePath = "uploads/"+imageID+".png"
modelPath = "public/savedModel/GBReg_20230303.pkl"


try:
    #Load the model (takes a second)
    model = pickle.load(open(modelPath, "rb"))

    #Convert the smileString to a readable format (molecule in rdkit)
    mol = Chem.MolFromSmiles(smileString)
    #Draw this molecule, save it to uploadImagePath.
    Draw.MolToFile(mol, uploadImagePath)
    
    #List of features to caculate from the smileString
    calc = Calculator([
        InformationContent.ComplementaryIC(order=0),
        Autocorrelation.ATSC(order=0,prop='v'),
        Constitutional.ConstitutionalMean(prop='v'),
        Autocorrelation.ATSC(order=3,prop='v'),
        Constitutional.ConstitutionalMean(prop='are'),
        Weight.Weight(),
        MoeType.SMR_VSA(k=9),
        Autocorrelation.MATS(order=1,prop='c'),
        InformationContent.InformationContent(order=0),
        Autocorrelation.MATS(order=2,prop='c'),
        EState.AtomTypeEState(type='count',estate='sSiH3')
    ])
    descrip = list(calc(mol))
    #Run these features (descript) through our model to predict our Tolman's parameter.
    output = model.predict([descrip])
    #Return this Tolman's parameter to app.js as a string
    print(round(output[0],2))
    
except Exception as e:
    print("ERROR") #print(e) # for troubleshooting
