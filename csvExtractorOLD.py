#Take a CSV file,
#open it through pandas into a df with one column, 
#extract the needed features from each smileString,
#Predict Tolman's parameter for each smileString,
#Append a column to our generated df and save it as a new csv file.

import sys
from rdkit import Chem
from mordred import Calculator, Autocorrelation, Constitutional, Weight, MoeType, EState, InformationContent
import numpy as np
import pickle
import pandas as pd

modelPath = "public/savedModel/GBReg_20230303.pkl"

#Find the features from a smileString, run them through the model, return the predicted Tolman's parameter.
def find_features(smileString):
    try:
        mol = Chem.MolFromSmiles(smileString)
        descrip = list(calc(mol))
        output = model.predict([descrip])
        return round(output[0],2)
    except:
        #Catch errors if we have an invalid smileString.
        return "NA"
    
#Main code. 
try:
    csvFilePath=sys.argv[1]
    #read CSV file into a pd dataframe.
    df = pd.read_csv(csvFilePath, names=["SmileStrings"], header=None)
    #Load the model (takes a second)
    model = pickle.load(open(modelPath, "rb"))
    #List of features to caculate from each smileString
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
    #Run the function above on each entry in the one column dataFrame. Create a new column of these TolmanPredictions.
    df["TolmanPrediction"] = df["SmileStrings"].apply(find_features)
    
    #Return this modified dataframe as a CSV file.
    df.to_csv(csvFilePath)
    #Need this print line so we return a string to the childProcess in app.js (there's likely a better way to do this.)
    print("Success!")

except Exception as e: print("ERROR") #print(e) if debugging


