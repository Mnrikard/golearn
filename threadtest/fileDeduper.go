
package main

import (
	"fmt"
	//"bufio"
	"os"
	"path/filepath"
	"sort"
	//"io/ioutil"
)

type finfo struct {
	name string
	fsize int64
	firstBytes []byte
	blen int64
	isdup bool
}

func main() {
	if len(os.Args) <= 1 {
		fmt.Println("You must pass a root directory to search for duplicates")
		return
	}
	rootDir := os.Args[1];

	erroredFiles, fileInfos := getFileList(rootDir);

	sort.Slice(fileInfos, func(a,b int)bool{
		return fileInfos[a].fsize < fileInfos[b].fsize
	});

	bysize := arrangeBySize(fileInfos);

	fmt.Printf("Read %d files, errored on %d files, possible dupes: %d\n", len(fileInfos), len(erroredFiles), len(bysize));

	for sz := range bysize {
		for i:=0;i<len(bysize[sz]);i++{
			fillFileInfo(bysize[sz][i]);
		}
		//todo: compare firstBytes then compare files altogether
		for i:=0;i<len(bysize[sz])-1;i++{
			for j:=i+1;j<len(bysize[sz]);j++{
				if(bysize[sz][j].isdup){
					continue;
				}
				if arrayEqual(bysize[sz][i].firstBytes, bysize[sz][j].firstBytes){
					if filesEqual(bysize[sz][i], bysize[sz][j]){
						bysize[sz][i].isdup = true;
						bysize[sz][j].isdup = true;
						fmt.Printf("%s\n%s\n\n", bysize[sz][i].name, bysize[sz][j].name);
					}
				}
			}
		}
	}
}

func arrayEqual(arr1 []byte, arr2 []byte) bool {
	for i:=0;i<len(arr1);i++{
		if(arr1[i] != arr2[i]){return false;}
	}
	return true;
}

func filesEqual(f1 finfo, f2 finfo) bool {
	b1 := make([]byte, f1.fsize);
	b2 := make([]byte, f2.fsize);

	_,err := fillBytes(f1, b1);
	if(err != nil){return false;}
	_,err = fillBytes(f2, b2);
	if(err != nil){return false;}

	return arrayEqual(b1, b2);
}

func fillBytes(file finfo, arr []byte) (int64, error){
	f, err := os.Open(file.name);
	defer f.Close();
	if err!=nil{
		fmt.Println(err);
	}

	var r int64 = 0;

	for r < int64(len(arr)) && r < file.fsize {
		readSoFar, err := f.Read(arr);
		if(err != nil){fmt.Printf("%s on %s;  ",err, file.name);return 0, err;}
		r += int64(readSoFar);
	}
	return r,nil;
}

func fillFileInfo(file finfo){
	file.blen,_ = fillBytes(file, file.firstBytes);
}

func arrangeBySize(files []finfo) map[int64][]finfo {
	output := make(map[int64][]finfo);

	for i:=0;i<len(files);i++{
		if files[i].fsize == 0 {continue;}
		if i > 0 && files[i].fsize == files[i-1].fsize{
			if(output[files[i].fsize] == nil){
				output[files[i].fsize] = make([]finfo,0)
			}
			output[files[i].fsize] = append(output[files[i].fsize], files[i]);
			continue;
		}
		if i+1<len(files) && files[i].fsize == files[i+1].fsize{
			if(output[files[i].fsize] == nil){
				output[files[i].fsize] = make([]finfo,0)
			}
			output[files[i].fsize] = append(output[files[i].fsize], files[i]);
		}
	}
	return output;
}


func getFileList(dir string) ([]string,[]finfo) {
	fileInfos := make([]finfo, 0)
	erroredFiles := make([]string,0)

	filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			erroredFiles = append(erroredFiles, path);
			return nil;
		}

		var emptyBytes = make([]byte,1024);
		fileInfos = append(fileInfos, finfo{path, info.Size(), emptyBytes, 0, false});
		return nil;
	});

	return erroredFiles, fileInfos;
}


