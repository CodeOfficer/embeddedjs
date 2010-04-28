
directory "dist"

file "embedded.min.js" => "dist" do
  sh "cat /dev/null > 'dist/embedded.min.js'"
end

desc "My Description"
task :default => "embedded.min.js" do
  puts "Hello World!"

end