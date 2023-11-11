import os
import pandas as pd

path = 'xyzs_of_dft_calucated_phosphines'

with open('combined.xyz','w') as output:
    for file in os.listdir(path):
        f = os.path.join(path,file)
        with open(f) as input:
            for line in input:
                if line.startswith("symmetry"):
                    output.write(file+"\n")
                else:
                    output.write(line)
        output.write("\n")
