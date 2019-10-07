
package stringutil

func Reverse(input string) string {
	runes := []rune(input);
	for i,j:=0,len(runes)-1;i<len(runes)/2; i,j = i+1, j-1 {
		runes[i], runes[j] = runes[j], runes[i];
	}
	return string(runes);
}
