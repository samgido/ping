package main

import (
	"fmt"
	"os"

	"github.com/evanw/esbuild/pkg/api"
)

func ServeWeb() {
	fmt.Println("Serving web/dist")

	build_options := api.BuildOptions{
		EntryPoints: []string{"web/src/app.ts"},
		Outdir:      "web/dist",
		Bundle:      true,
	}

	build_result := api.Build(build_options)
	if len(build_result.Errors) > 0 {
		os.Exit(1)
	}

	ctx, err := api.Context(build_options)

	if err != nil {
		os.Exit(1)
	}

	_, err2 := ctx.Serve(api.ServeOptions{
		Servedir: "web/dist",
	})
	if err2 != nil {
		os.Exit(1)
	}
	<-make(chan struct{})
}
