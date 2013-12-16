require 'sinatra'
require 'rack_ssi'

PORT = 3364  # 3D

configure do
  use Rack::SSI, {
    :logging => :on,
    :when => lambda {|env| not env['SOME_CUSTOM_HEADER'] == 'ON'},
    :locations => {
      %r{^/includes} => "http://localhost:#{PORT}"
    }
  }
end

set :port, PORT
set :public_folder, File.dirname(__FILE__)

get '/' do
  send_file 'index.html'
end

get '/*/' do
  path = params[:splat].first
  puts "PATH >>>>>  #{path}"
  path = "#{path}/index.html"

  send_file path
end

not_found do
  send_file 'missing.html'
end
