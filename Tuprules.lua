
tup.include("util/strict.lua")
tup.include("util/lua-ext.lua")
tup.include("util/interpolation.lua")
tup.include("util/tup-ext.lua")

ROOTDIR = tup.getcwd()

function pad(opts)
    return rep{
        "convert ${input} -background transparent -gravity center -extent ${w}x${h} ${output}",
        input = opts.input or "%f",
        output = opts.output or "%o",
        w = opts.w,
        h = opts.h
    }
end

function asboolean(s)
    if s == nil or s == "false" then
        return false
    elseif s == "true" then
        return true
    else
        error("boolean config must be true, false, or empty")
    end
end

local DEFAULT_OPTIPNG = getconfig("DEFAULT_OPTIPNG")
local DEFAULT_ADVPNG = getconfig("DEFAULT_ADVPNG")
local DEFLOPT_PATH = getconfig("DEFLOPT_PATH")
local DEFAULT_DEFLOPT = asboolean(getconfig("DEFAULT_DEFLOPT"))

function compresspng(opts)
    local cmds = {}
    local output = opts.output or "%o"
    local optipng = DEFAULT_OPTIPNG
    local advpng = DEFAULT_ADVPNG
    local deflopt = DEFAULT_DEFLOPT
    if opts.config then
        optipng = getconfig(opts.config .. "_OPTIPNG") or optipng;
        advpng = getconfig(opts.config .. "_ADVPNG") or advpng;
        deflopt = asboolean(getconfig(opts.config .. "_DEFLOPT")) or deflopt;
    end

    if optipng then
        cmds += rep{"optipng -q ${opts} ${output}", opts=optipng, output=output}
    end
    if advpng then
        cmds += rep{"advpng -q ${opts} ${output}", opts=advpng, output=output}
    end
    if deflopt then
        if DEFLOPT_PATH == nil then
            error("Need to set CONFIG_DEFLOPT_PATH")
        end
        cmds += rep{"node ${root}/tools/deflopt ${deflopt} ${output}",
                    root=ROOTDIR,
                    deflopt=DEFLOPT_PATH,
                    output=output}
    end
    
    return cmds
end
