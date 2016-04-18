<?php

/**
 * Description of utm
 *
 * @author Thiago Adriano
 */
class UTM {
    public function decodeUTMDB($parameter)
    {
        if(isset($parameter)){
            echo "inicio";
            $utmdbDecode = "";
            $utmdb = $parameter;
            for($i = 0; $i < count($utmdb); $i++){
                $decode = json_decode($utmdb[$i]);
                echo $decode;
                if($i > 1){
                    $utmdbDecode .= " | - | ";
                }
                $utmdbDecode .= 'Data: ' . $decode->data . ' | ';
                $utmdbDecode .= 'Página: ' . $decode->pagina . ' | ';
                (isset($decode->origem)   ? $utmdbDecode .= 'Origem: '   . $decode->origem   : '');
                (isset($decode->midia)    ? $utmdbDecode .= ' | Mídia: '    . $decode->midia  : '');
                (isset($decode->termo)    ? $utmdbDecode .= ' | Termo: '    . $decode->termo    : '');
                (isset($decode->conteudo) ? $utmdbDecode .= ' | Conteúdo: ' . $decode->conteudo : '');
                (isset($decode->campanha) ? $utmdbDecode .= ' | Campanha: ' . $decode->campanha : '');  
                echo $utmdbDecode;
            }
        }

        return $utmdbDecode;
    }
    
    public function decodeEmail($list)
    {
        if(!empty($list) && is_array($list)){
            $content = '<p><strong>Dados da Origem:<br></strong>';
            for($i = 0; $i < count($list); $i++){
                $decode = json_decode($list[$i]);
                $content .= 'Data: ' . $decode->data . '<br>';
                $content .= 'Página: ' . $decode->pagina . '<br>';
                (isset($decode->origem)   ? $content .= 'Origem: '   . $decode->origem   . '<br>' : '');
                (isset($decode->midia)    ? $content .= 'Mídia: '    . $decode->midia    . '<br>' : '');
                (isset($decode->termo)    ? $content .= 'Termo: '    . $decode->termo    . '<br>' : '');
                (isset($decode->conteudo) ? $content .= 'Conteúdo: ' . $decode->conteudo . '<br>' : '');
                (isset($decode->campanha) ? $content .= 'Campanha: ' . $decode->campanha . '<br>' : '');  
                $content .= '<hr>';
            }

            $content .= '</p>';
            
            return $content;
        }
    }
    
    
}
