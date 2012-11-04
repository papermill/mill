if [[ ! -o interactive ]]; then
    return
fi

compctl -K _mill mill

_mill() {
  local word words completions
  read -cA words
  word="${words[2]}"

  if [ "${#words}" -eq 2 ]; then
    completions="$(mill commands)"
  else
    completions="$(mill completions "${word}")"
  fi

  reply=("${(ps:\n:)completions}")
}
