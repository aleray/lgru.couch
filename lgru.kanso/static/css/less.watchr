def compile_css(f)
    system(<<-eos
        lessc                 #{f[1]}baseline.all.less > ../css/#{f[1]}baseline.all.css      && 
        echo                 "#{f[1]}baseline.all.less > ../css/#{f[1]}baseline.all.css"     && 
        lessc --yui-compress  #{f[1]}baseline.all.less > ../css/#{f[1]}baseline.all.min.css  && 
        echo                 "#{f[1]}baseline.all.less > ../css/#{f[1]}baseline.all.min.css"

        lessc                 #{f[0]} > ../css/#{f[1]}#{f[2]}.css      && 
        echo                 "#{f[0]} > ../css/#{f[1]}#{f[2]}.css"     && 
        lessc --yui-compress  #{f[0]} > ../css/#{f[1]}#{f[2]}.min.css  && 
        echo                 "#{f[0]} > ../css/#{f[1]}#{f[2]}.min.css"
        eos
    )
end


watch('(.*)(baseline\..*)(\.less)$') { |f| compile_css(f) }

# vim: ft=ruby
