/*criando um analisador lexo para a seguinde linguagem: operações aritméticas com hierarquia. */
/*Ex.: [2*(4+3)], 100, {w-[3-5]+{4-(x-((y)))-1}-9}-8, valor+contador, ({[(2)]}), [2-{x-5}] */
/*Contra Ex.: ({[(2)]}), [2-{x-5}] */


function main(expression){
	let regExModulado, stringAux;
	regExModulado   = spacesRemove(expression);

	console.log("Analisador Léxico de: " + expression);
	analisadorLexico(regExModulado);

	console.log("---------------------------------------");

	console.log("ANalisador Sintático de: " + expression);
	let returnLexicalAnalyzer = analisadorSintatico(regExModulado);
	console.log((returnLexicalAnalyzer == 0) ? "nenhum erro sintático encontrado" : returnLexicalAnalyzer + " ERROR!!!");
}

/* função que remove todos os espaços para ajudar na análisa léxica */
function spacesRemove(regExString){
	const re = new RegExp(" ", "g");
	return regExString.replace(re, "");
}

function analisadorLexico(regExModulado){
	
	const reAlfa   = new RegExp("[a-zA-Z]");
	const reNum    = new RegExp("[0-9]");
	const reSinais = new RegExp("\\+|\\-|\\*|\\/")
	let [countAlfa, countNum, increment] = [0, 0, 0];

	do{
		//letras
		if(regExModulado[increment].match(reAlfa) && countNum == 0){
			countAlfa++;
			if(regExModulado.length == increment + 1) console.log("IDENT");
		}else{
			if(countAlfa > 0){
				countAlfa = 0;
				console.log("IDENT");
			}
		}

		//numeros
		if(regExModulado[increment].match(reNum) && regExModulado.length != increment + 1){
			countNum++;
			if(regExModulado.length == increment + 1) console.log("NUM");
		}else{
			if(countNum > 0){
				countNum = 0;
				console.log("NUM")
			}
		}

		//sinais
		if(regExModulado[increment].match(reSinais)){
			console.log("OPER");
		}

		//{
		if(regExModulado[increment].match("\\{")){
			console.log("ABRE-CHA");
		}
		
		//[
		if(regExModulado[increment].match("\\[")){
			console.log("ABRE-COL");
		}
		
		//(
		if(regExModulado[increment].match("\\(")){
			console.log("ABRE-PAR");
		}
		
		//)
		if(regExModulado[increment].match("\\)")){
			console.log("FECHA-PAR");
		}
		
		//]
		if(regExModulado[increment].match("\\]")){
			console.log("FECHA-COL");
		}

		//}
		if(regExModulado[increment].match("\\}")){
			console.log("FECHA-CHA");
		}


	increment++;
	}while(increment != regExModulado.length)

	const expressionEveryCaracteres = new RegExp("[^a-z0-9A-Z\\}\\]\\)\\{\\[\\(\\*\\/\\+\\- ]", "g");
	let error = regExModulado.match(expressionEveryCaracteres) != null ? 
	console.log("a avaliação léxica encontrou erros: " + regExModulado.match(expressionEveryCaracteres)) :
	console.log("nenhum erro léxico encontrado");
}

/* função que irá validar, como analisador lexico a expressão enviada */
function analisadorSintatico(regExModulado){
	let countError = 0;

	/*caso 1: verifica existe apenas os caracteres possíveis da linguagem: letras, numeros, sinais, {}, [], ()*/
	if(checkCase1(regExModulado)) countError++;

	/*caso 2: verifica se as chaves, colchetes e parenteses tem valores pares. isso não elimina o fato de poder existir expressões do tipo: {a-][+10}*/
	if(checkCase2(regExModulado)) countError++;

	/*caso 3: verifica se as chaves, colchetes e parenteses tem seu valor sintáxico, ou seja, se ao abrir, se fecha*/
	if(checkCase3(regExModulado)) countError++;
	
	/*caso 4: conferir se a hierarquia das chaves, colchetes e parenteses foram obedecidas*/
	if(checkCase4(regExModulado)) countError++;

	/*caso 5: verifica se existe um final e início de chaves/colchetes/parenteses consecutivamente sem um sinal entre eles: }{, ][, )(*/
	if(checkCase5(regExModulado)) countError++;

	/*caso 6: verifica se existe sinais consecutivos */
	if(checkCase6(regExModulado)) countError++;

	/*caso 7: verifica se existe um numero após ou antes de uma chave/colchetes/parenteses sem um sinal entre eles: 3{}, ()1, 2[]6*/
	if(checkCase7(regExModulado)) countError++;
	
	return countError;
}

function checkCase1(regExModulado){
	const re = new RegExp("[^a-z0-9A-Z\\}\\]\\)\\{\\[\\(\\*\\/\\+\\- ]", "g");
	if(!(regExModulado.match(re) == null)) return console.log("(caracteres inválidos)            -> " + regExModulado.match(re));
	return false;
}

function checkCase2(regExModulado){
	const re = new RegExp("[\\)\\]\\}\\{\\[\\(]", "g");
	const qtdRe = (regExModulado.match(re) == null) ? 0 : regExModulado.match(re).length; 
	if(qtdRe % 2 != 0) return console.log("(valores ímpares de barramentos)  -> " + qtdRe);
	return false;
}

function checkCase3(regExModulado){
	let [countKeys, countBrackets, countParentheses, messageError] = [0,0,0, new Array()];
	
	for(let indexRegEx = 0; indexRegEx < regExModulado.length; indexRegEx++){
		switch(regExModulado[indexRegEx]){
			case "{":
				countKeys++;
				continue;
			case "[":
				countBrackets++;
				continue;
			case "(":
				countParentheses++;
				continue;
			case "}":
				if(countKeys == 0) messageError.push("}");
				countKeys--;
				continue;
			case "]":
				if(countBrackets == 0) messageError.push("]");
				countBrackets--;
				continue;
			case ")":
				if(countParentheses == 0) messageError.push(")");
				countParentheses--;
				continue;
		}
	}
	if(countKeys > 0 || countBrackets > 0 || countParentheses > 0) return console.log("(abertura ou fechamento inválido) -> " + messageError);
	return false;
}

function checkCase4(regExModulado){
	let [countKeys, countBrackets, countParentheses, messageError] = [0,0,0, new Array()];
	
	for(let indexRegEx = 0; indexRegEx < regExModulado.length; indexRegEx++){
		switch(regExModulado[indexRegEx]){
			case "{":
				if(countBrackets > 0 || countParentheses > 0) messageError.push("{");
				countKeys++;
				continue;
			case "[":
				if(countParentheses > 0) messageError.push("[");
				countBrackets++;
				continue;
			case "(":
				countParentheses++;
				continue;
			case "}":
				countKeys--;
				continue;
			case "]":
				countBrackets--;
				continue;
			case ")":
				countParentheses--;
				continue;
		}
	}
	if(messageError.length > 0) return console.log("(hierarquia inválida)             -> " + messageError);
	return false;
}

function checkCase5(regExModulado){
	const re = new RegExp("[\\)|\\]|\\}][\\(|\\[|\\{]", "g");
	if(!(regExModulado.match(re) == null)) return console.log("(barramentos abertos)             -> " + regExModulado.match(re));
	return false;
}

function checkCase6(regExModulado){
	const re = new RegExp("(\\+|\\-|\\*|\\/){2}", "g");
	if(!(regExModulado.match(re) == null)) return console.log("(sinais consecutivos)             -> " + regExModulado.match(re));
	return false;
}

function checkCase7(regExModulado){
	const re = new RegExp("[a-zA-Z0-9][\\{|\\[|\\(]|[\\}|\\]|\\)][a-zA-Z0-9]", "g");
	if(!(regExModulado.match(re) == null)) return console.log("(falta de sinais)                 -> " + regExModulado.match(re));
	return false;
}


main(" teste + (17 - a)");
main("[(24) / 8+5 *3]/ 6 }{ +- d( & ({})");
main("[(22+1)]");
//main("[(24) / (8+5) *3]/ 6");
//main("(24) / (8+5)");
//main("24 / (8+5)");
//main("(2)");
//main("{[(10)]]");
//main("[(24) / 8+5 *3]/ 6 }{ +- d(");
//main("{[(42 + 3)/7)");
//main("{[5 + 18]2 – 2})");
//main("a{)");
//main("10(2))");
//main("1)");
//main("{[5 + 18] . 2 – 2})");
//main("(d+f[1]*4))");
//main("12+*4)");
//main("}{)");
