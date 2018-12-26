source "https://rubygems.org"
ruby "2.6.0"

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

gem "rails", "~> 5.0.5"
gem "pg", "~> 0.18"
gem "puma", "~> 3.0"
gem "jbuilder", "~> 2.5"
gem "paperclip", "~> 6.0.0"
gem "aws-sdk-s3", "~> 1"
gem "figaro"
gem "devise", "4.4.3"
gem "devise_token_auth", "0.2.0"
gem "omniauth", "1.3.1"
gem "omniauth-facebook", "4.0.0"
gem "omniauth-google-oauth2", "0.5.2"
gem "rack-cors"
gem "sprockets"

group :development, :test do
  gem "byebug", platform: :mri
end

group :development do
  gem "listen", "~> 3.0.5"
  gem "foreman", "~> 0.82.0"
  gem "spring"
  gem "spring-watcher-listen", "~> 2.0.0"
  gem "rubocop"
  gem "travis"
end

gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]
