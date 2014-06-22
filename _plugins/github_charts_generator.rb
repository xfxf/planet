# Jekyll plugin for fetching data from GitHub to generate more detailed views
#
# Author: Maciej Paruszewski <maciek.paruszewski@gmail.com>
# Site: http://github.com/pinoss
#
# Distributed under the MIT license
# Copyright Maciej Paruszewski 2014

module Jekyll

  class GitHubStatsGenerator < Generator
    priority :low
    safe true

    # Generates data for pages with users key
    #
    # site - the site
    #
    # Returns nothing
    def generate(site)
      site.pages.each do |page|
        if page.data.key? 'projects'
          fetch_project_data(page)
        end
      end
    end

    private

    def fetch_project_data(page)
      require 'octokit'
      require 'json'

      projects = page.data['projects']

      projects_data = {}

      projects.each do |project|
        projects_data[project] = {}

        projects_data[project]['name'] = project

        pie_chart_data = 
        projects_data[project]['pie_chart'] = contributors_pie_chart_data(project)
      end

      page.data['projects_data'] = projects_data
    end

    def contributors_pie_chart_data(project)
      raw_data = get_data(:contributors_stats, project)

      preprocessed_data = raw_data.map do |data|
        [ data[:author][:login], data[:weeks].map { |week| week[:a] + 0.5 * week[:d] + 10 * week[:c] }.inject(:+) ]
      end

      sum = preprocessed_data.map { |author, number| number }.inject(:+)
      
      additional_data = {}
      raw_data.each do |data|
        additional_data[data[:author][:login]] = {
            additions: data[:weeks].map { |week| week[:a] }.inject(:+),
            deletions: data[:weeks].map { |week| week[:d] }.inject(:+),
            commits:   data[:weeks].map { |week| week[:c] }.inject(:+)
          }
      end

      result = preprocessed_data.map do |author, number| 
        {
          name:      author,
          y:         number,
          additions: additional_data[author][:additions],
          deletions: additional_data[author][:deletions],
          commits:   additional_data[author][:commits]
        }
      end

      result.to_json
    end

    def client
      @client ||= Octokit::Client.new \
        :login    => ENV['OCTOKIT_LOGIN'],
        :password => ENV['OCTOKIT_PASWD']
    end

    def get_data(type, project)
      result = nil

      3.times do
        result = client.send(type, project)
        return result unless result.nil?

        sleep 1 
      end

      result
    end
  end
end