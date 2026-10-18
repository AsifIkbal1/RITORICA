import { spawn } from "node:child_process";
import http from "node:http";
import path from "node:path";

const TICKET_PORT = 8081;
const TICKET_URL = `http://localhost:${TICKET_PORT}`;
const TICKET_DIR = path.resolve(process.cwd(), "goal-scaffold-kit-main");

export async function isTicketServerRunning(): Promise<boolean> {
  return new Promise((resolve) => {
    const req = http.get(TICKET_URL, (res) => {
      resolve(res.statusCode !== undefined && res.statusCode < 500);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(1500, () => {
      req.destroy();
      resolve(false);
    });
  });
}

export async function ensureTicketServer(): Promise<{ running: boolean; url: string; newlyStarted: boolean }> {
  const alreadyRunning = await isTicketServerRunning();
  if (alreadyRunning) {
    return { running: true, url: TICKET_URL, newlyStarted: false };
  }

  const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
  const proc = spawn(npmCmd, ["run", "dev"], {
    cwd: TICKET_DIR,
    shell: true,
    detached: true,
    stdio: "ignore",
    env: { ...process.env, PORT: String(TICKET_PORT) },
  });
  proc.unref();

  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 500));
    if (await isTicketServerRunning()) {
      return { running: true, url: TICKET_URL, newlyStarted: true };
    }
  }

  return { running: false, url: TICKET_URL, newlyStarted: true };
}
