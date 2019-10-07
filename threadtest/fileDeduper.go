
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
			fillBytes(bysize[sz][i]);
		}
	}
}

func fillBytes(file finfo) {
	f, err := os.Open(file.name);
	if err!=nil{
		panic(err);
	}

	var r int64 = 0;

	for r < 1024 && r < file.fsize {
		readSoFar, err := f.Read(file.firstBytes);
		if(err != nil){panic(err);}
		r += int64(readSoFar);
	}
	file.blen = r;
}

func arrangeBySize(files []finfo) map[int64][]finfo {
	output := make(map[int64][]finfo);

	for i:=1;i<len(files);i++{
		if files[i].fsize == files[i-1].fsize{
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
	delete(output,0);
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
		fileInfos = append(fileInfos, finfo{path, info.Size(), emptyBytes, 0});
		return nil;
	});

	return erroredFiles, fileInfos;
}


