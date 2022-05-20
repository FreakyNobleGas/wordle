package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

type MarshalExample struct {
	Message string
	Age     int
	Name    string
}

func foo(w http.ResponseWriter, _ *http.Request) {
	w.Write([]byte("Hello World"))
}

func main() {
	// Example JSON marshalling struct
	data, _ := json.Marshal(&MarshalExample{
		Message: "Hi",
		Age:     20,
		Name:    "Bob",
	})
	fmt.Println(string(data))

	// Example unmarshalling JSON object
	f := MarshalExample{}
	err := json.Unmarshal([]byte(`{"Message":"Hi","Age":20,"Name":"Bob"}`), &f)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(f)

	http.HandleFunc("/foo", foo)
	err = http.ListenAndServe(":5000", nil)
	if err != nil {
		fmt.Print(err)
	}
}
