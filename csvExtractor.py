import sys
from rdkit import Chem
from mordred import Calculator, Autocorrelation, Constitutional, Weight, MoeType, EState, InformationContent
import numpy as np
import pickle
import pandas as pd


def find_features(smileString):
    try:
        mol = Chem.MolFromSmiles(smileString)
        descrip = list(calc(mol))
        output = model.predict([descrip])
        return round(output[0],2)
    except:
        return "NA"
    

try:
    csvFilePath=sys.argv[1]
    df = pd.read_csv(csvFilePath, names=["SmileStrings"], header=None)
    model = pickle.load(open("public/savedModel/GBReg_20230303.pkl", "rb"))
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
    df["TolmanPrediction"] = df["SmileStrings"].apply(find_features)
    df.to_csv(csvFilePath)
    print("Success!")

except Exception as e: print("ERROR")


