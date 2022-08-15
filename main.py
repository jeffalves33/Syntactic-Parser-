from ast import expr
from itertools import count
import re

#função que retorna o tamanho de um array. Usamos essa função para retornar a quantidade de elementos de um
#array já que python não nos retorna isso da melhor forma através de um método qualquer.
def sizeVector(vector):
	count = 0
	for index in vector:
		count += 1
	return count

#função que remove todos os espaços da expressão para ajudar na busca de erros
def espaco(expression):
	expRegExp = r" "
	return expression.replace(expRegExp, "")
	
#caso 1: verifica existe apenas os caracteres possíveis da linguagem: letras, numeros, sinais, {}, [], ()
def checkCase1(regExModulado):
	regExModulado = regExModulado
	expRegExp = r"[^a-z0-9A-Z\}\]\)\{\[\(\*\/\+\- ]"
	if((re.findall(expRegExp, regExModulado) != None)): return print("(caracteres inválidos)            -> ", re.findall(expRegExp, regExModulado))
	else: return 0

#caso 2: verifica se as chaves, colchetes e parenteses tem valores pares. isso não elimina o fato de poder existir expressões do tipo: {a-][+10}
def checkCase2(regExModulado):
	regExModulado = regExModulado
	expRegExp = r"[\)\]\}\{\[\(]"
	if((re.findall(expRegExp, regExModulado) != None)): return print("(valores ímpares de barramentos)  -> ", re.findall(expRegExp, regExModulado))
	else: return 0

#caso 3: verifica se as chaves, colchetes e parenteses tem seu valor sintáxico, ou seja, se ao abrir, se fecha
def checkCase3(regExModulado):
	countKeys        = 0
	countBrackets    = 0
	countParentheses = 0
	messageError     = []
	
	for indexRegEx in regExModulado:
		if(indexRegEx == "{")  : countKeys+= 1
		elif(indexRegEx == "["): countBrackets+= 1
		elif(indexRegEx == "("): countParentheses+= 1
		elif(indexRegEx == "}"):
			if(countKeys == 0): messageError.append("}")
			countKeys-= 1
		elif(indexRegEx == "]"):
			if(countBrackets == 0): messageError.append("]")
			countBrackets-= 1
		elif(indexRegEx == ")"):
			if(countParentheses == 0): messageError.append(")")
			countParentheses-= 1

	if(countKeys > 0 or countBrackets > 0 or countParentheses or 0): return print("(abertura ou fechamento inválido) -> ", messageError)
	else: return 0

#caso 4: conferir se a hierarquia das chaves, colchetes e parenteses foram obedecidas
def checkCase4(regExModulado):
	countKeys        = 0
	countBrackets    = 0
	countParentheses = 0
	messageError     = []
	
	for indexRegEx in regExModulado:
		if(indexRegEx == "{"):
			if(countBrackets > 0 or countParentheses > 0): messageError.append("{")
			countKeys+= 1
		elif(indexRegEx == "["):
			if(countParentheses > 0): messageError.append("[")
			countBrackets+= 1
		elif(indexRegEx == "("): countParentheses+= 1
		elif(indexRegEx == "}"): countKeys-= 1
		elif(indexRegEx == "]"): countBrackets-= 1
		elif(indexRegEx == ")"): countParentheses-= 1

	if(sizeVector(messageError) > 0): return print("(hierarquia inválida)             -> ", messageError)
	else: return 0

#caso 5: verifica se existe um final e início de chaves/colchetes/parenteses consecutivamente sem um sinal entre eles: }{, ][, )(
def checkCase5(regExModulado):
	regExModulado = regExModulado
	expRegExp = r"[\)|\]|\}][\(|\[|\{]"
	if((re.findall(expRegExp, regExModulado) != None)): return print("(barramentos abertos)             -> ", re.findall(expRegExp, regExModulado))
	else: return 0

#caso 6: verifica se existe sinais consecutivos
def checkCase6(regExModulado):
	regExModulado = regExModulado
	expRegExp = r"(\+|\-|\*|\/){2}"
	if((re.findall(expRegExp, regExModulado) != None)): return print("(sinais consecutivos)             -> ", re.findall(expRegExp, regExModulado))
	return 0

#caso 7: verifica se existe um numero após ou antes de uma chave/colchetes/parenteses sem um sinal entre eles: 3{}, ()1, 2[]6
def checkCase7(regExModulado):
	regExModulado = regExModulado
	expRegExp = r"[a-zA-Z0-9][\{|\[|\(]|[\}|\]|\)][a-zA-Z0-9]"
	if((re.findall(expRegExp, regExModulado) != None)): return print("(falta de sinais)                 -> ", re.findall(expRegExp, regExModulado));
	return 0

#função que irá validar, como analisador lexico a expressão enviada
def lexicalAnalyzer(regExModulado):
	countError = 0

	#caso 1: verifica existe apenas os caracteres possíveis da linguagem: letras, numeros, sinais, {}, [], ()
	if(checkCase1(regExModulado) != 0): countError+= 1

	#caso 2: verifica se as chaves, colchetes e parenteses tem valores pares. isso não elimina o fato de poder existir expressões do tipo: {a-][+10}
	if(checkCase2(regExModulado) != 0): countError+= 1
	
	#caso 3: verifica se as chaves, colchetes e parenteses tem seu valor sintáxico, ou seja, se ao abrir, se fecha
	if(checkCase3(regExModulado) != 0): countError+= 1
	
	#caso 4: conferir se a hierarquia das chaves, colchetes e parenteses foram obedecidas
	if(checkCase4(regExModulado) != 0): countError+= 1

	#caso 5: verifica se existe um final e início de chaves/colchetes/parenteses consecutivamente sem um sinal entre eles: }{, ][, )(
	if(checkCase5(regExModulado) != 0): countError+= 1

	#caso 6: verifica se existe sinais consecutivos
	if(checkCase6(regExModulado) != 0): countError+= 1

	#caso 7: verifica se existe um numero após ou antes de uma chave/colchetes/parenteses sem um sinal entre eles: 3{}, ()1, 2[]6
	if(checkCase7(regExModulado) != 0): countError+= 1

	return countError

#função principal
def main(expression):
	expression = expression
	print(expression)
	returnLexicalAnalyzer = lexicalAnalyzer(espaco(expression))
	if(returnLexicalAnalyzer == 0): print("ACEITO!!!")
	else: print(returnLexicalAnalyzer, " ERROR!!!")

main("[(24) / 8+5 *3]/ 6 }{ +- d( & ({}) ")