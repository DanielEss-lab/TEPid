import sys
from rdkit.Chem import AllChem
from rdkit import Chem
from rdkit.Chem import Descriptors
from rdkit.ML.Descriptors import MoleculeDescriptors
from mordred import Calculator, descriptors, Autocorrelation, Constitutional, Weight, MoeType, EState, InformationContent
import numpy as np


smileString=sys.argv[1]

try:
    mol = Chem.MolFromSmiles(smileString)
    canonSmile = Chem.MolToSmiles(mol)
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
    descrip = calc(mol)
    print(descrip)
except:
    print("ERROR")


