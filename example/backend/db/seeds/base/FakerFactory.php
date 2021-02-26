<?php

namespace Backend\Seeds;

use Faker\Factory;
use Faker\Generator;
use Faker\Provider\Base;

class FakerFactory
{
    /**
     * @var Generator
     */
    protected static $faker;

    public static function get(): Generator
    {
        if (!self::$faker) {
            $faker = Factory::create('de_DE');

            $faker->addProvider(new FakerLoremProvider($faker));

            $newClass = new class($faker) extends Base
            {
                public function word()
                {
                    // http://frequencylists.blogspot.com/2016/01/the-2980-most-frequently-used-german.html
                    $words = explode("\n", trim(file_get_contents(__DIR__ . '/../data/nouns.txt')));
                    // remove 2 first array elements
                    array_shift($words);
                    array_shift($words);
                    // take top 400
                    $words = array_splice($words, 0, 1000);
                    // random word
                    $row = $words[array_rand($words)];
                    // remove ord
                    $row = preg_replace('/^.*? /', '', $row);
                    // remove articles
                    $row = preg_replace('/(Der|Die|Das) /', '', $row);
                    // find tanslations
                    preg_match_all('/^(.*?) – (.*?) ~ (.+)/', $row, $matches, PREG_SET_ORDER);
                    [$all, $en, $de, $dePlural] = $matches[0];
                    return $en;
                }
            };

            $faker->addProvider($newClass);

            self::$faker = $faker;
        }

        return self::$faker;
    }
}
