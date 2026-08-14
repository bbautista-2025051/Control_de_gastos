import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { FloatingParticles } from "./shared/floating-particles/floating-particles";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, FloatingParticles],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {}
