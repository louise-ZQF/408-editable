import { mkdir, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

if (process.platform !== 'darwin') throw new Error('此安装器用于这台 Mac 的自动同步')
const root = fileURLToPath(new URL('../', import.meta.url))
const label = 'com.huyawen.408-personal-sync'
const directory = join(homedir(), 'Library/LaunchAgents')
const logs = join(homedir(), 'Library/Logs/408-editable')
await mkdir(directory, { recursive: true }); await mkdir(logs, { recursive: true })
const xml = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
const plist = join(directory, label + '.plist')
await writeFile(plist, `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0"><dict><key>Label</key><string>${label}</string><key>ProgramArguments</key><array><string>${xml(process.execPath)}</string><string>${xml(join(root, 'scripts/personal-sync-daemon.mjs'))}</string></array><key>WorkingDirectory</key><string>${xml(root)}</string><key>EnvironmentVariables</key><dict><key>PATH</key><string>${xml(join(homedir(), '.local/bin'))}:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin</string></dict><key>RunAtLoad</key><true/><key>KeepAlive</key><true/><key>ThrottleInterval</key><integer>30</integer><key>StandardOutPath</key><string>${xml(join(logs, 'personal-sync.log'))}</string><key>StandardErrorPath</key><string>${xml(join(logs, 'personal-sync-error.log'))}</string></dict></plist>`)
const domain = 'gui/' + process.getuid()
try { execFileSync('/bin/launchctl', ['bootout', domain + '/' + label], { stdio: 'ignore' }) } catch { /* 首次安装没有旧进程。 */ }
execFileSync('/bin/launchctl', ['bootstrap', domain, plist], { stdio: 'inherit' })
console.log('已启用登录后自动运行的个人教材同步服务')
