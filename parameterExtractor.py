import sys
from rdkit.Chem import AllChem
from rdkit import Chem
from rdkit.Chem import Descriptors
from rdkit.ML.Descriptors import MoleculeDescriptors
from mordred import Calculator, descriptors
import numpy as np


smileString=sys.argv[1]

try:
    mol = Chem.MolFromSmiles(smileString)
    canonSmile = Chem.MolToSmiles(mol)
    calc = MoleculeDescriptors.MolecularDescriptorCalculator([x[0] for x in Descriptors._descList])
    desc_names = calc.GetDescriptorNames()
    desc_values = calc.CalcDescriptors(mol)
    dicOFDescriptors = {desc_names[i]: desc_values[i] for i in range(len(desc_names))}
    print(dicOFDescriptors)
except:
    print("ERROR")


