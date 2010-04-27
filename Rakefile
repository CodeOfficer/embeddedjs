
desc "Task description"
task :default do
  directory "dist"

  file "embedded.min.js" => "dist" do
    sh "echo '/dev/null' > 'dist/embedded.min.js'"
  end
end
