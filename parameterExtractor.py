#Take a smileString,
#Extract the needed features using morded,
#Run through features through our ML model to predict a Tolman's parameter
#Return this predicted Tolman's parameter as a print statement to app.js 

import sys
from rdkit import Chem
from rdkit.Chem import Draw
from rdkit.ML.Descriptors.MoleculeDescriptors import MolecularDescriptorCalculator
import numpy as np
import pickle

smileString= sys.argv[1]
imageID = sys.argv[2]
uploadImagePath = "uploads/"+imageID+".png"
#modelPath = "public/savedModel/GBReg_20230303.pkl"
modelPath= "public/savedModel/LGBMReg_20230720.pkl"


# In the list add the names of the descriptors required
listOfRdKITDescriptors = [
    'EState_VSA9',
    'BCUT2D_CHGLO',
    'VSA_EState1',
    'Ipc',
    'BCUT2D_MRHI',
    'SlogP_VSA12',
    'EState_VSA1',
    'VSA_EState3',
    'VSA_EState10',
    'fr_halogen',
    'EState_VSA10',
    'BCUT2D_LOGPHI',
    'VSA_EState8',
    'BCUT2D_CHGHI',
    'MolMR',
    'MaxPartialCharge',
    'Kappa1',
    'NumRotatableBonds',
    'SlogP_VSA6'
]

try:
    #Load the model (takes a second)
    model = pickle.load(open(modelPath, "rb"))

    #Convert the smileString to a readable format (molecule in rdkit)
    mol = Chem.MolFromSmiles(smileString)
    #Draw this molecule, save it to uploadImagePath.
    Draw.MolToFile(mol, uploadImagePath)
    


    calculator = MolecularDescriptorCalculator(listOfRdKITDescriptors)
    descrip = list(calculator.CalcDescriptors(mol))
    # calc = Calculator([
    #     MoeType.EState_VSA(k=9), # EState_VSA9
    #     BCUT.BCUT(prop='c', nth=0), #Likely wrong # BCUT2D_CHGLO
    #     PathCount.PathCount(order=1, pi=False, total=False, log=False), # Ipc
    #     MoeType.VSA_EState(k=1), #VSA_EState1 #why is this different than EState_VSA9?
    #     BCUT.BCUT(prop='m', nth=0), #BCUT2D_MRHI
    #     MoeType.SlogP_VSA(k=12), #SlogP_VSA12 # I dont think k can be 12?
    #     MoeType.EState_VSA(k=1), #EState_VSA1
    #     MoeType.VSA_EState(k=3), # VSA_EState3
    #     MoeType.VSA_EState(k=10),# VSA_EState10
    #     AtomCount.AtomCount(type='X'), # fr_halogen #Maybe??
    #     BCUT.BCUT(prop='pe', k=0), # BCUT2D_LOGPHI
    #     MoeType.VSA_EState(k=8), # VSA_EState8

    # ])
    # BCUT2D_CHGHI
    # MolMR
    # MaxPartialCharge
    # Kappa1
    # NumRotatableBonds
    # SlogP_VSA6

    #Run these features (descript) through our model to predict our Tolman's parameter.
    output = model.predict([descrip])
    #Return this Tolman's parameter to app.js as a string
    print(round(output[0],2))
    
except Exception as e:
    print(e)
    print("ERROR") #print(e) # for troubleshooting
