/**
 * Regra de layout do grid de projetos.
 *
 * O mockup aprovado tinha cinco projetos: duas fileiras de dois e o ultimo
 * ocupando a linha inteira. Como a lista passou a vir do conteudo, a regra
 * precisa valer para qualquer quantidade, senao "configuravel" seria mentira.
 *
 * Fica isolada aqui para ser testavel: os cenarios do spec sao casos de teste
 * diretos, em vez de conferencia no navegador a cada mudanca.
 */

/** Um projeto ocupa a linha inteira quando sobra sozinho na ultima fileira. */
export function ocupaLinhaInteira(indice: number, total: number): boolean {
  return total % 2 === 1 && indice === total - 1;
}
