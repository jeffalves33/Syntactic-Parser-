/*criando um analisador lexo para a seguinde linguagem: operações aritméticas com hierarquia. */
/*Ex.: [2*(4+3)], 100, {w-[3-5]+{4-(x-((y)))-1}-9}-8, valor+contador, ({[(2)]}), [2-{x-5}] */
/*Contra Ex.: ({[(2)]}), [2-{x-5}] */


function main(expression){
	let regExModulado, stringAux;
	regExModulado   = spacesRemove(expression);
	console.log(regExModulado);
	let returnLexicalAnalyzer = lexicalAnalyzer(regExModulado);
	console.log((returnLexicalAnalyzer == 0) ? "ACEITO!!!" : returnLexicalAnalyzer + " ERROR!!!");
}

/* função que remove todos os espaços para ajudar na análisa léxica */
function spacesRemove(regExString){
	const re = new RegExp(" ", "g");
	return regExString.replace(re, "");
}

/* função que irá validar, como analisador lexico a expressão enviada */
function lexicalAnalyzer(regExModulado){
	let countError = 0;
	let messageTotalError = "";

	/*caso 1: verifica existe apenas os caracteres possíveis da linguagem: letras, numeros, sinais, {}, [], ()*/
	if(!checkCase1(regExModulado)) countError++;

	/*caso 2: verifica se as chaves, colchetes e parenteses tem valores pares. isso não elimina o fato de poder existir expressões do tipo: {a-][+10}*/
	if(!checkCase2(regExModulado)) countError++;

	/*caso 3: verifica se as chaves, colchetes e parenteses tem seu valor sintáxico, ou seja, se ao abrir, se fecha*/
	if(!checkCase3(regExModulado)) countError++;
	
	/*caso 4: conferir se a hierarquia das chaves, colchetes e parenteses foram obedecidas*/
	if(!checkCase4(regExModulado)) countError++;

	/*caso 5: verifica se existe um final e início de chaves/colchetes/parenteses consecutivamente sem um sinal entre eles: }{, ][, )(*/
	if(!checkCase5(regExModulado)) countError++;

	/*caso 6: verifica se existe sinais consecutivos */
	if(!checkCase6(regExModulado)) countError++;

	/*caso 7: verifica se existe um numero após ou antes de uma chave/colchetes/parenteses sem um sinal entre eles: 3{}, ()1, 2[]6*/
	if(!checkCase7(regExModulado)) countError++;
	
	return countError;
}

function checkCase1(regExModulado){
	const re = new RegExp("[^a-z0-9A-Z\\}\\]\\)\\{\\[\\(\\*\\/\\+\\- ]", "g");
	if(!(regExModulado.match(re) == null)) return console.log("(caracteres inválidos)            -> " + regExModulado.match(re));
	return false;
}

function checkCase2(regExModulado){
	const re = new RegExp("[\\)\\]\\}\\{\\[\\(]", "g");
	if(!(regExModulado.match(re) == null)) return console.log("(valores ímpares de barramentos)  -> " + regExModulado.match(re));
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
	if(countKeys > 0 | countBrackets > 0 | countParentheses > 0) return console.log("(abertura ou fechamento inválido) -> " + messageError);
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


const expressions = 
[
	"(2)                ",
	"{[(10)]]           ",
	"[(24) / 8+5 *3]/ 6 }{ +- d( ",
	"{[(42 + 3)/7       ",
	"{[5 + 18]2 – 2}    ",
	"a{                 ",
	"10(2)              ",
	"1                  ",
	"{[5 + 18] . 2 – 2} ",
	"(d+f[1]*4)         ",
	"12+*4              ",
	"}{                 "
];

main("[(24) / 8+5 *3]/ 6 }{ +- d( & ({})")

