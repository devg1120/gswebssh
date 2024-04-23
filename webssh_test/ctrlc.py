

try:
    while True:  # なんらかの重い処理 (for だったり while だったり。。。)
        pass  # ここに、Ctrl-C で止めたい処理を書く
except KeyboardInterrupt:
    # Ctrl-C を捕まえた！
    print('interrupted!')
    pass  # なにか特別な後片付けが必要ならここに書く
    # プログラムをこの時点で殺すなら sys.exit する
# あとは普通の処
