import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { FloatingParticles } from "./shared/floating-particles/floating-particles";
import { SessionToast } from "./shared/session-toast/session-toast";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, FloatingParticles, SessionToast],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {}
