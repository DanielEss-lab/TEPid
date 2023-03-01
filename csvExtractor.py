import sys
from rdkit.Chem import AllChem
from rdkit import Chem
from rdkit.Chem import Descriptors
from rdkit.ML.Descriptors import MoleculeDescriptors
from mordred import Calculator, descriptors, Autocorrelation, Constitutional, Weight, MoeType, EState, InformationContent
import numpy as np

csvFilePath=sys.argv[1]


try:
    smileStringList = []
    with open(csvFilePath) as file:
        for line in file:
            line = line.strip()
            l = line.split(",")
            smileStringList.extend(l)
    print(smileStringList)
        
    for smileString in smileStringList:

        mol = Chem.MolFromSmiles(smileString)
        canonSmile = Chem.MolToSmiles(mol)
        #calc = MoleculeDescriptors.MolecularDescriptorCalculator([x[0] for x in Descriptors._descList])
        calc = MoleculeDescriptors.MolecularDescriptorCalculator([x[0] for x in featureList])

        desc_names = calc.GetDescriptorNames()
        desc_values = calc.CalcDescriptors(mol)
        dicOFDescriptors = {desc_names[i]: desc_values[i] for i in range(len(desc_names))}
        print(dicOFDescriptors)
except:
    print("ERROR")