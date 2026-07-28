cask "re-triever" do
  version "1.0.0"
  sha256 :no_check # Automatically fetches latest release binary from GitHub

  url "https://github.com/Re-triever/Re-triever/releases/download/v#{version}/Re-triever-#{version}-arm64.dmg"
  name "Re:triever"
  desc "Zero-Setup Automatic Background Version Control for macOS"
  homepage "https://re-triever.github.io/Re-triever/"

  livecheck do
    url "https://github.com/Re-triever/Re-triever/releases/latest"
    strategy :github_latest
  end

  app "Re-triever.app", target: "Re:triever.app"

  zap trash: [
    "~/.re-triever",
    "~/Library/Application Support/Re:triever",
    "~/Library/Preferences/com.retriever.app.plist",
  ]
end
