/*criando um analisador lexo para a seguinde linguagem: operações aritméticas com hierarquia. */
/*Ex.: [2*(4+3)], 100, {w-[3-5]+{4-(x-((y)))-1}-9}-8, valor+contador, ({[(2)]}), [2-{x-5}] */
/*Contra Ex.: ({[(2)]}), [2-{x-5}] */


function main(expressions){
	let regExModulado, stringAux;
	for(let i = 0; i < expressions.length; i++){
		regExModulado   = spacesRemove(expressions[i]);
		stringAux = (lexicalAnalyzer(regExModulado) == "") ? "ACEITO!!!" : lexicalAnalyzer(regExModulado);
		console.log(expressions[i] + " = " + stringAux);
	}
}

/* função que remove todos os espaços para ajudar na análisa léxica */
function spacesRemove(regExString){
	const re = new RegExp(" ", "g");
	return regExString.replace(re, "");
}

/* função que irá validar, como analisador lexico a expressão enviada */
function lexicalAnalyzer(regExModulado){
	let messageTotalError = "";
	
	/*caso 1: verifica existe apenas os caracteres possíveis da linguagem: letras, numeros, sinais, {}, [], ()*/
	if(!checkCase1(regExModulado)) messageTotalError+= "(caracteres inválidos)";

	/*caso 2: verifica se as chaves, colchetes e parenteses tem valores pares. isso não elimina o fato de poder existir expressões do tipo: {a-][+10}*/
	if(!checkCase2(regExModulado)) messageTotalError+= "(valores ímpares de barramentos)"

	/*caso 3: verifica se as chaves, colchetes e parenteses tem seu valor sintáxico, ou seja, se ao abrir, se fecha*/
	if(!checkCase3(regExModulado)) messageTotalError+= "(abertura ou fechamento inválido)"
	
	/*caso 4: conferir se a hierarquia das chaves, colchetes e parenteses foram obedecidas*/
	if(!checkCase4(regExModulado)) messageTotalError+= "(hierarquia inválida)"

	/*caso 5: verifica se existe um final e início de chaves/colchetes/parenteses consecutivamente sem um sinal entre eles: }{, ][, )(*/
	if(!checkCase5(regExModulado)) messageTotalError+= "(barramentos abertos)"

	/*caso 6: verifica se existe sinais consecutivos */
	if(!checkCase6(regExModulado)) messageTotalError+= "(sinais consecutivos)"

	/*caso 7: verifica se existe um numero após ou antes de uma chave/colchetes/parenteses sem um sinal entre eles: 3{}, ()1, 2[]6*/
	if(!checkCase7(regExModulado)) messageTotalError+= "(falta de sinais)"

	return messageTotalError;
}

function checkCase1(regExModulado){
	const re = new RegExp("[^a-z0-9A-Z\\}\\]\\)\\{\\[\\(\\*\\/\\+\\- ]", "g");
	return((regExModulado.match(re) == null) ? true : false);
}

function checkCase2(regExModulado){
	const re = new RegExp("[\\)\\]\\}\\{\\[\\(]", "g");
	const countChar = (regExModulado.match(re) == null) ? 0 : regExModulado.match(re).length;
	return (countChar%2 == 0) ? true : false;
}

function checkCase3(regExModulado){
	let [countKeys, countBrackets, countParentheses] = [0,0,0];
	
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
				if(countKeys == 0) return false;
				countKeys--;
				continue;
			case "]":
				if(countBrackets == 0) return false;
				countBrackets--;
				continue;
			case ")":
				if(countParentheses == 0) return false;
				countParentheses--;
				continue;
		}
	}
	if(countKeys > 0 | countBrackets > 0 | countParentheses > 0) return false;
	return true;
}

function checkCase4(regExModulado){
	let [countKeys, countBrackets, countParentheses] = [0,0,0];
	
	for(let indexRegEx = 0; indexRegEx < regExModulado.length; indexRegEx++){
		switch(regExModulado[indexRegEx]){
			case "{":
				if(countBrackets > 0 || countParentheses > 0) return false;
				countKeys++;
				continue;
			case "[":
				if(countParentheses > 0) return false;
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
	return true;
}

function checkCase5(regExModulado){
	const regEx = new RegExp("[\\)|\\]|\\}][\\(|\\[|\\{]");
	return ((regExModulado.match(regEx) == null) ? true : false);
}

function checkCase6(regExModulado){
	const regEx = new RegExp("(\\+|\\-|\\*|\\/){2}");
	return ((regExModulado.match(regEx) == null) ? true : false);
}

function checkCase7(regExModulado){
	const re = new RegExp("[a-zA-Z0-9][\\{|\\[|\\(]|[\\}|\\]|\\)][a-zA-Z0-9]");
	return((regExModulado.match(re) == null) ? true : false);
}


const expressions = 
[
	"(2)                ",
	"{[(10)]]           ",
	"[(24) / 8+5 *3]/ 6 ",
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

main(expressions)

