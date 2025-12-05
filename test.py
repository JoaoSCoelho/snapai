
def enumerate(lista: list):
    result: list = [];
    for i in range(len(lista)):
        result.append((i, lista[i]));
    
    return result

for i, value in enumerate(["gato", "cachorro", "rato"]):
    print(i)
    print(value)