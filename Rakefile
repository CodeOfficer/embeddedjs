
directory "dist"

file "embedded.min.js" => "dist" do
  sh "cat /dev/null > dist/embedded.min.js"
  sh "java -jar script/yuicompressor-2.2.4.jar --charset=utf-8 src/ejs.js >> dist/embedded.min.js"
  sh "java -jar script/yuicompressor-2.2.4.jar --charset=utf-8 src/view.js >> dist/embedded.min.js"
end

desc "Build the file"
task :default => "embedded.min.js" do
  puts "Hello World!"

end