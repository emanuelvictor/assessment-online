package br.com.ubest.application.security;

import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class LocalMap {

    private static LocalMap instance;

    private Map<String, Object> map;

    private LocalMap(){
        this.map = new HashMap<>();
    }

    //static block initialization for exception handling
    static{
        try{
            instance = new LocalMap();
        }catch(Exception e){
            throw new RuntimeException("Exception occured in creating singleton instance");
        }
    }

    public static LocalMap getInstance(){
        return instance;
    }


}
