import sys
from rdkit import Chem
from mordred import Calculator, Autocorrelation, Constitutional, Weight, MoeType, EState, InformationContent
import numpy as np
import pickle

#csvFilePath=sys.argv[1]

csvFilePath="/Users/harlanstevens/Downloads/smileString.csv"

with open(csvFilePath) as file:
    file.
try:
    model = pickle.load(open("public/savedModel/GBReg_20230303.pkl", "rb"))
    featureList = ["CIC0", "ATSC0v", "Mv", "ATSC3v", "Mare", "AMW", "SMR_VSA9", "MATS1c", "IC0", "MATS2c", "SsSiH3"]
    
    mol_list = []
    for smiles in smiles_list:
        mol = Chem.MolFromSmiles(smiles)
        mol_list.append(mol)

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
    output = model.predict([descrip])
    print(output)
except Exception as e: print(e)



# try:
#     smileStringList = []
#     with open(csvFilePath) as file:
#         for line in file:
#             line = line.strip()
#             l = line.split(",")
#             smileStringList.extend(l)
#     print(smileStringList)
        
#     for smileString in smileStringList:

#         mol = Chem.MolFromSmiles(smileString)
#         canonSmile = Chem.MolToSmiles(mol)
#         #calc = MoleculeDescriptors.MolecularDescriptorCalculator([x[0] for x in Descriptors._descList])
#         calc = MoleculeDescriptors.MolecularDescriptorCalculator([x[0] for x in featureList])

#         desc_names = calc.GetDescriptorNames()
#         desc_values = calc.CalcDescriptors(mol)
#         dicOFDescriptors = {desc_names[i]: desc_values[i] for i in range(len(desc_names))}
#         print(dicOFDescriptors)
# except:
#     print("ERROR")