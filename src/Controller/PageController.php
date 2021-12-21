<?php

namespace Drupal\doane_directory\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Link;
use Drupal\Core\Render\Markup;
use Drupal\Core\Render\Element;
use Drupal\Core\Url;

/**
 * Controller routines for page example routes.
 */
class PageController extends ControllerBase {

  /**
   * {@inheritdoc}
   */

  public function getSheet () {
    //Cache Seconds * Minutes
    header("Cache-Control: max-age=900"); 
    header("Vary: Cookie,User-Agent,Accept-Encoding");
    $file = file_get_contents('https://docs.google.com/spreadsheets/d/1lhV3lhkq6ihCZvhkxhfNfQcZJy5C8KpYtD4XdrXVfiY/gviz/tq?tqx=out:json&sheet=Sheet2');
    $file = str_replace('google.visualization.Query.setResponse(', "", $file);
    $file = str_replace('/*O_o*/', "", $file);
    $file = str_replace(");", "", $file);
    return $file;
    }


  protected function getModuleName() {
    return 'doane_covid_dashboard';
  }

}
