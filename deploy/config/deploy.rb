# config valid for current version and patch releases of Capistrano
lock "~> 3.14.1"
# config/deploy.rb

set :application, "gigsasa-front"
set :repo_url, "git@github.com:skedone/gigsasa-dashboard-web.git"
set :deploy_to, "/var/www/sandbox.gigsasa.com"
set :format, :airbrussh
set :format_options, command_output: true, log_file: "log/capistrano.log", color: :auto, truncate: :auto
set :keep_releases, 5
set :deploy_via, :remote_cache
set :ssh_options, {
    :forward_agent => true,
    :keepalive => true,
    :keepalive_interval => 30
}
set :repository_cache, "git_cache"

set :build_command, 'GENERATE_SOURCEMAP=false NODE_OPTIONS=--max_old_space_size=4096 REACT_APP_API_URL="http://gigsasa.com/gigsasa_backend/api" npm run build'

namespace :gigsasa do
    desc "Build Gigsasa application"
    task :build do
        on roles(:all) do
          execute "cd #{release_path} && #{fetch(:build_command)}"
        end
    end

    before 'deploy:updated', 'gigsasa:build'
end
