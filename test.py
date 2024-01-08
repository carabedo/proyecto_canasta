import pandas as pd 
df=pd.read_csv('data_canasta.csv',index_col=0)
df.name=df.name.str.lower()